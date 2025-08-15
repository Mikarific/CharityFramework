import { Plugin, PluginState } from '.';
import { GM_fetch } from '../utils/fetch';
import { defineGlobalPath, defineHiddenPath } from '../utils/global';

const PLUGIN_STATES_KEY = 'WPF.plugins';

export const loadPlugins = async () => {
	defineHiddenPath(window.WPF, 'internal');
	Object.defineProperty(window.WPF.internal, 'plugins', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: [],
	});

	defineGlobalPath(window.WPF, 'plugin');
	Object.defineProperty(window.WPF.plugin, 'register', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: (plugin: Plugin) => {
			window.WPF.internal.plugins.push(plugin);
			console.log('[WPF]', 'registered plugin', plugin.id, `(${plugin.version})`);
		},
	});

	const pluginStates: PluginState[] = JSON.parse(localStorage.getItem(PLUGIN_STATES_KEY) ?? '[]');

	for (const state of pluginStates) {
		if (!state.enabled) continue;
		const index = pluginStates.indexOf(state);
		try {
			const res = await GM_fetch({ method: 'GET', url: state.url + '?' + Date.now() });
			if (res.status !== 200) {
				console.warn('[WPF] plugin url', state.url, `failed to load, status=${res.status}`);
				continue;
			}

			const prevLength = window.WPF.internal.plugins.length;
			eval(res.responseText);

			if (prevLength === window.WPF.internal.plugins.length) {
				console.warn('[WPF]', 'plugin url', state.url, 'never registered a plugin');
				state.error = 'never registered a plugin';
				continue;
			}

			state.error = null;
		} catch (error) {
			state.enabled = false;
			state.error = error.toString();
		}

		pluginStates[index] = state;
	}

	localStorage.setItem(PLUGIN_STATES_KEY, JSON.stringify(pluginStates));
};
