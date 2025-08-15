import { Plugin, PluginState } from '.';

const PLUGIN_STATES_KEY = 'wpf.plugins';

export const loadPlugins = async () => {
	Object.defineProperty(window.WPF, 'plugins', { configurable: false, enumerable: true, writable: false, value: [] });

	Object.defineProperty(window.WPF, 'registerPlugin', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: (plugin: Plugin) => {
			window.WPF.plugins.push(plugin);
			console.log('[WPF]', 'registered plugin', plugin.id, `(${plugin.version})`);
		},
	});

	const pluginStates: PluginState[] = JSON.parse(localStorage.getItem(PLUGIN_STATES_KEY) ?? '[]');

	for (const state of pluginStates) {
		if (!state.enabled) continue;
		const index = pluginStates.indexOf(state);
		try {
			const res = await fetch(state.url + '?' + Date.now());
			if (!res.ok) {
				console.warn('[WPF] plugin url', state.url, `failed to load, status=${res.status}`);
				continue;
			}

			const code = await res.text();

			const prevLength = window.WPF.plugins.length;
			eval(code);

			if (prevLength === window.WPF.plugins.length) {
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
