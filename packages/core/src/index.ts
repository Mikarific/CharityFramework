import './meta.js?userscript-metadata';
import { builtinPatches } from './patches';
import { loadPlugins } from './plugins/loader';
import * as resources from './utils/resources';
import * as ui from './ui';
import { executeDeepLink } from './deeplink';
import { Patch } from '@placecharity/framework-types';

window.stop();
(async () => {
	await resources.init();
	if (await executeDeepLink()) return;
	const unparsedHtml = await (await fetch(window.charity.internal.currentUrlOverride ?? location.href)).text();
	const parsedHtml = new DOMParser().parseFromString(unparsedHtml, 'text/html');
	for (const attr of document.firstElementChild.attributes) {
		document.firstElementChild.removeAttributeNode(attr);
	}
	for (const attr of parsedHtml.firstElementChild.attributes) {
		document.firstElementChild.setAttributeNode(attr.cloneNode() as Attr);
	}
	document.firstElementChild.replaceChildren(...parsedHtml.firstElementChild.children);

	// cursed as fuck double header patch, replace this with a fork of esmshims later lmao
	window.fetch = new Proxy(window.fetch, {
		async apply(target, thisArg, args) {
			const response = await Reflect.apply(target, thisArg, args);
			const contentType = response.headers.get('Content-Type');
			if (contentType && contentType === 'application/javascript, application/javascript') {
				const headers = new Headers(response.headers);
				headers.set('Content-Type', 'application/javascript');
				const patched = new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers,
				});
				Object.defineProperty(patched, 'url', { value: response.url });
				Object.defineProperty(patched, 'ok', { value: response.ok });
				Object.defineProperty(patched, 'redirected', { value: response.redirected });
				Object.defineProperty(patched, 'type', { value: response.type });
				return patched;
			}
			return response;
		},
	});

	await loadPlugins();

	const patches: Patch[] = [
		...builtinPatches(),
		...window.charity.internal.plugins
			.map((plugin) =>
				plugin.def.patches.map((patch) => ({
					...patch,
					name: `${plugin.manifest.id}_${patch.name}`,
				})),
			)
			.flat(1),
	];

	ui.init();

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
					console.log(`[Charity] patching ${url} with patch ${patch.name}`);

					const replaced = sourceStr.replace(patch.replace.match, patch.replace.replace);

					if (replaced === sourceStr) {
						console.warn('[Charity] patch ' + patch.name + ' made no changes to ' + url + ' even though it matched');
						continue;
					}

					console.debug('[Charity]', 'new', url, 'after patch', patch.name, replaced);
					sourceStr = replaced;
				}
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
	for (const script of document.querySelectorAll<HTMLScriptElement>('script:not([type])')) {
		const scriptShim = document.createElement('script');
		// es-module-shims assumes that everything is running as an es module, so this bullshit is needed.
		scriptShim.innerText = script.innerText.replaceAll('import(', 'importShim(');
		for (const attr of script.attributes) scriptShim.setAttribute(attr.name, attr.value);
		script.replaceWith(scriptShim);
	}

	for (const plugin of window.charity.internal.plugins) {
		await plugin.def.init({ manifest: plugin.manifest, utils: plugin.utils });
	}
})();
