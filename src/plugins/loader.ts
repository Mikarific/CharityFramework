import { Plugin, PluginState } from '.';
import { GM_fetch } from '../utils/fetch';
import { defineGlobalPath, defineHiddenPath } from '../utils/global';
import semver from 'semver';

const PLUGIN_STATES_KEY = 'charity.plugins';

export const loadPlugins = async () => {
	defineHiddenPath(window.charity, 'internal');
	Object.defineProperty(window.charity.internal, 'plugins', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: [],
	});

	defineGlobalPath(window.charity, 'plugin');
	Object.defineProperty(window.charity.plugin, 'register', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: (plugin: Plugin) => {
			if (!semver.satisfies(GM.info.script.version, plugin.versions.framework)) {
				throw new Error(
					'plugin ' +
						plugin.id +
						' wants framework version ' +
						plugin.versions.framework +
						' but the present framework version is only ' +
						GM.info.script.version +
						'! please update your Charity Framework version',
				);
			}

			window.charity.internal.plugins.push(plugin);
			console.log('[Charity]', 'registered plugin', plugin.id, `(${plugin.version})`);
		},
	});

	const pluginStates: PluginState[] = JSON.parse(localStorage.getItem(PLUGIN_STATES_KEY) ?? '[]');

	for (const state of pluginStates) {
		if (!state.enabled) continue;
		const index = pluginStates.indexOf(state);
		try {
			const res = await GM_fetch({ method: 'GET', url: state.url + '?' + Date.now() });
			if (res.status !== 200) {
				console.warn('[Charity] plugin url', state.url, `failed to load, status=${res.status}`);
				continue;
			}

			const prevLength = window.charity.internal.plugins.length;
			eval(res.responseText);

			if (prevLength === window.charity.internal.plugins.length) {
				console.warn('[Charity]', 'plugin url', state.url, 'never registered a plugin');
				state.error = 'never registered a plugin';
				continue;
			}

			state.error = null;
		} catch (error) {
			// state.enabled = false;
			state.error = error.toString();
			console.error('[Charity]', 'plugin url', state.url, 'failed to load', error);
		}

		pluginStates[index] = state;
	}

	localStorage.setItem(PLUGIN_STATES_KEY, JSON.stringify(pluginStates));
};
