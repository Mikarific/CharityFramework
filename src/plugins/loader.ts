import { Plugin } from '.';

const PLUGIN_URLS_KEY = 'wpf.plugins';

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

	const pluginUrls: string[] = JSON.parse(localStorage.getItem(PLUGIN_URLS_KEY) ?? '[]');

	for (const url of pluginUrls) {
		const res = await fetch(url + '?' + Date.now());
		if (!res.ok) {
			console.warn('[WPF] plugin url', url, `failed to load, status=${res.status}`);
			continue;
		}

		const code = await res.text();

		const prevLength = window.WPF.plugins.length;
		eval(code);

		if (prevLength === window.WPF.plugins.length) {
			console.warn('[WPF]', 'plugin url', url, 'never registered a plugin');
			continue;
		}
	}
};
