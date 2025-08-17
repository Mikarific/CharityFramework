import { fetchManifest, Plugin, PluginDefinition, PluginManifest, PluginState, validatePluginDefintion } from '.';
import { fetchWithoutCORS, getValue, setValue } from '../utils/gm';

export const getPluginStates = async (): Promise<PluginState[]> => getValue('plugins', []);
export const setPluginStates = async (states: PluginState[]) => await setValue('plugins', states);

/** This function WILL throw on manifest validation failures */
export const addPlugin = async (url: string) => {
	const manifest = await fetchManifest(url);
	const pluginStates = await getPluginStates();
	if (pluginStates.find((s) => s.url === url || s.id === manifest.id)) throw new Error('plugin already installed');
	pluginStates.push({ id: manifest.id, url, enabled: true, error: null });
	await setPluginStates(pluginStates);
};

export const removePlugin = async (id: string) => {
	let pluginStates = await getPluginStates();
	pluginStates = pluginStates.filter((s) => s.id !== id);
	await setPluginStates(pluginStates);
};

export const loadPlugin = async (url: string, manifest: PluginManifest) => {
	const res = await fetchWithoutCORS(url + 'index.js?' + Date.now());
	if (!res.ok) {
		throw new Error('failed to fetch bundle status=' + res.status);
	}

	const code = await res.text();

	const def: PluginDefinition = await eval(code);
	validatePluginDefintion(def);

	const plugin: Plugin = { manifest, def };
	window.charity.internal.plugins.push(plugin);
	console.log('[Charity]', 'registered plugin', manifest.id, `(${manifest.version})`);
};

export const loadPlugins = async () => {
	Object.defineProperty(window.charity.internal, 'plugins', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: [],
	});

	const pluginStates: PluginState[] = await getPluginStates();

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

	await setPluginStates(pluginStates);
};
