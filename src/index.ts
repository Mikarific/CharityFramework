import './meta.js?userscript-metadata';
import { builtinPatches, Patch } from './patches';
import { loadPlugins } from './plugins/loader';
import { defineGlobalPath } from './utils/global';

(async () => {
	const unparsedHtml = await (await fetch(location.href)).text();
	const parsedHtml = new DOMParser().parseFromString(unparsedHtml, 'text/html');
	for (const attr of document.firstElementChild.attributes) {
		document.firstElementChild.removeAttributeNode(attr);
	}
	for (const attr of parsedHtml.firstElementChild.attributes) {
		document.firstElementChild.setAttributeNode(attr.cloneNode() as Attr);
	}
	document.firstElementChild.replaceChildren(...parsedHtml.firstElementChild.children);

	defineGlobalPath(window, 'WPF');
	await loadPlugins();

	const patches: Patch[] = [
		...builtinPatches(),
		...window.WPF.plugins
			.map((plugin) =>
				plugin.patches.map((patch) => ({
					...patch,
					name: `${plugin.id}_${patch.name}`,
				})),
			)
			.flat(1),
		,
	];

	window.esmsInitOptions = {
		shimMode: true,
		nativePassthrough: false,
		async source(url: string, fetchOpts: RequestInit, parent, defaultSourceHook) {
			const src: {
				url: string;
				type: 'js' | 'wasm' | 'css' | 'json' | 'ts';
				source: string | WebAssembly.Module;
			} = await defaultSourceHook(url, fetchOpts, parent);
			if (typeof src.source === 'string') {
				let sourceStr = src.source as string;
				for (const patch of patches) {
					if (!patch) continue;
					if (patch.disable) continue;

					if (!sourceStr.includes(patch.find)) continue;
					console.log(`[WPF] patching ${url} with patch ${patch.name}`);

					const replaced = sourceStr.replace(patch.replace.match, patch.replace.replace);

					if (replaced === sourceStr) {
						console.warn('[WPF] patch ' + patch.name + ' made no changes to ' + url + ' even though it matched');
						continue;
					}

					console.debug('[WPF]', 'new', url, 'after patch', patch.name, replaced);
					sourceStr = replaced;
				}

				// sourceStr += `console.log("Hooked: ${url}");`;

				src.source = sourceStr;
			}
			return src;
		},
	};
	for (const module of document.querySelectorAll('script[type="module"]')) {
		module.setAttribute('type', 'module-shim');
	}
	for (const module of document.querySelectorAll('link[rel="modulepreload"]')) {
		module.setAttribute('rel', 'modulepreload-shim');
	}
	await import('https://esm.sh/es-module-shims');
	for (const script of document.querySelectorAll('script:not([type])')) {
		Object.defineProperty(document, 'currentScript', {
			value: script,
			configurable: true,
		});
		// es-module-shims assumes that everything is running as an es module, so this bullshit is needed.
		eval((script as HTMLScriptElement).innerText.replaceAll('import(', 'importShim('));
	}
	Object.defineProperty(document, 'currentScript', {
		value: null,
		configurable: true,
	});

	for (const plugin of window.WPF.plugins) {
		await plugin.load();
	}
})();
