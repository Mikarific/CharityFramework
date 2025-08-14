import './meta.js?userscript-metadata';

const elem = document.createElement('script');
elem.textContent = `window.stop();(${(async () => {
	Object.defineProperty(window, 'WPF', { configurable: false, enumerable: true, writable: false, value: {} });
	Object.defineProperty(window.WPF, 'lib', { configurable: false, enumerable: true, writable: false, value: {} });
	Object.defineProperty(window.WPF, 'game', { configurable: false, enumerable: true, writable: false, value: {} });
	const unparsedHtml = await (await fetch(location.href)).text();
	const parsedHtml = new DOMParser().parseFromString(unparsedHtml, 'text/html');
	for (const attr of document.firstElementChild.attributes) {
		document.firstElementChild.removeAttributeNode(attr);
	}
	for (const attr of parsedHtml.firstElementChild.attributes) {
		document.firstElementChild.setAttributeNode(attr.cloneNode() as Attr);
	}
	document.firstElementChild.replaceChildren(...parsedHtml.firstElementChild.children);

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
				const expose = (path: string, name: string, value: string, regex?: RegExp) => {
					if (regex !== null && regex !== undefined) {
						src.source = (src.source as string).replace(regex, (match) => {
							return `${match}Object.defineProperty(window.WPF.${path},'${name}',{configurable:false,enumerable:true,writable:false,value:${value}});`;
						});
					} else {
						src.source += `Object.defineProperty(window.WPF.${path},'${name}',{configurable:false,enumerable:true,writable:false,value:${value}});`;
					}
				};
				const path = (path: string, name: string) => {
					eval(
						`Object.defineProperty(window.WPF.${path},'${name}',{configurable:false,enumerable:true,writable:false,value:{}});`,
					);
				};
				const match = (regex: RegExp) => (src.source as string).match(regex)?.[1] ?? null;

				if (src.source.includes('__paraglide')) {
					path('lib', 'paraglide');
					const getLocale = match(/([a-zA-Z_$][a-zA-Z0-9_$]*)=\(\)=>.*getLocale/);
					if (getLocale) expose('lib.paraglide', 'getLocale', getLocale);
					const setLocale = match(/([a-zA-Z_$][a-zA-Z0-9_$]*)=\([^)]*,[^)]*\)=>.*setLocale/);
					if (setLocale) expose('lib.paraglide', 'setLocale', setLocale);
				}

				if (src.source.includes('backend.wplace.live')) {
					const data = match(/([a-zA-Z_$][a-zA-Z0-9_$]*)={[^{]*?countries:[^}]*?}/);
					if (data) {
						expose('game', 'colors', `${data}.colors`);
						expose('game', 'countries', `${data}.countries`);
						expose('game', 'regionSize', `${data}.regionSize`);
						expose('game', 'seasons', `${data}.seasons`);
					}

					path('lib', 'sonner');
					const toast = match(/([a-zA-Z_$][a-zA-Z0-9_$]*)=Object\.assign.*?getActiveToasts/);
					if (toast) expose('lib.sonner', 'toast', toast);

					const userClass = match(/class ([a-zA-Z_$][a-zA-Z0-9_$]*)[^}]*?user-channel/);
					if (userClass) {
						const user = match(new RegExp(`([a-zA-Z_$][a-zA-Z0-9_$]*)=new ${userClass}`));
						if (user) expose('game', 'user', user);
					}
				}

				if (src.source.includes('MapLibre GL JS')) {
					const maplibre = match(/new ([a-zA-Z_$][a-zA-Z0-9_$]*)\.Map/);
					if (maplibre) {
						expose('lib', 'maplibre', maplibre);
						const map = match(new RegExp(`([a-zA-Z_$][a-zA-Z0-9_$]*)=new ${maplibre}.Map`));
						if (map) {
							expose('game', 'map', map, new RegExp(`${map}=new ${maplibre}.Map\\(.*?}\\);`));
						}
					}
				}
			}
			src.source += `console.log("Hooked: ${url}");`;
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
}).toString()})();`;
document.documentElement.appendChild(elem);
