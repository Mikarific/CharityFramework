import { fetchManifest, Plugin, PluginDefinition, PluginManifest, PluginState, validatePluginDefintion } from '.';
import { GM_fetch } from '../utils/fetch';
import { defineHiddenPath } from '../utils/global';

const PLUGIN_STATES_KEY = 'charity.plugins';

/** This function WILL throw on manifest validation failures */
export const addPlugin = async (url: string) => {
	const manifest = await fetchManifest(url);
	const pluginStates = getPluginStates();
	if (pluginStates.find((s) => s.url === url || s.id === manifest.id)) throw new Error('plugin already installed');
	pluginStates.push({ id: manifest.id, url, enabled: true, error: null });
	setPluginStates(pluginStates);
};

export const removePlugin = (id: string) => {
	let pluginStates = getPluginStates();
	pluginStates = pluginStates.filter((s) => s.id !== id);
	setPluginStates(pluginStates);
};

export const getPluginStates = (): PluginState[] => JSON.parse(localStorage.getItem(PLUGIN_STATES_KEY));
export const setPluginStates = (states: PluginState[]) =>
	localStorage.setItem(PLUGIN_STATES_KEY, JSON.stringify(states));

export const loadPlugin = async (url: string, manifest: PluginManifest) => {
	const res = await GM_fetch({ method: 'GET', url: url + 'index.js?' + Date.now() });
	if (res.status !== 200) {
		throw new Error('failed to fetch bundle status=' + res.status);
	}

	const code = res.responseText;

	const def: PluginDefinition = await eval(code);
	validatePluginDefintion(def);

	const plugin: Plugin = { manifest, def };
	window.charity.internal.plugins.push(plugin);
	console.log('[Charity]', 'registered plugin', manifest.id, `(${manifest.version})`);
};

export const loadPlugins = async () => {
	defineHiddenPath(window.charity, 'internal');
	Object.defineProperty(window.charity.internal, 'plugins', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: [],
	});

	const pluginStates: PluginState[] = JSON.parse(localStorage.getItem(PLUGIN_STATES_KEY) ?? '[]');

	await Promise.all(
		pluginStates
			.filter((s) => s.enabled)
			.map(async (state) => {
				if (!state.enabled) return;
				const index = pluginStates.indexOf(state);
				try {
					const url = state.url.endsWith('/') ? state.url : state.url + '/';
					const manifest = await fetchManifest(url);

					if (manifest.id !== state.id) {
						console.warn(
							'[Charity]',
							'plugin at url',
							url,
							'id changed from',
							state.id,
							'to',
							manifest.id,
							'updating state',
						);
						state.id = manifest.id;
					}

					await loadPlugin(url, manifest);

					state.error = null;
				} catch (error) {
					// state.enabled = false;
					state.error = `${error}`;
					console.error('[Charity]', 'plugin url', state.url, 'failed to load', error);
				}

				pluginStates[index] = state;
			}),
	);

	localStorage.setItem(PLUGIN_STATES_KEY, JSON.stringify(pluginStates));
};
