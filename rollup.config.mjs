import { isAbsolute, relative, resolve } from 'path';
import { defineConfig } from 'rollup';

import babelPlugin from '@rollup/plugin-babel';
import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import userscript from 'rollup-plugin-userscript';
import postcssPlugin from 'rollup-plugin-postcss';
import terserPlugin from '@rollup/plugin-terser';

import { readPackageUp } from 'read-package-up';
const { packageJson } = await readPackageUp();

const extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx'];

export default defineConfig([
	{
		input: 'src/index.ts',
		plugins: [
			postcssPlugin({
				inject: false,
				minimize: true,
				modules: {
					generateScopedName: 'charity-[hash:base64:6]',
				},
			}),
			babelPlugin({
				babelHelpers: 'runtime',
				plugins: [
					[
						import.meta.resolve('@babel/plugin-transform-runtime'),
						{
							useESModules: true,
							version: '^7.5.0'
						}
					]
				],
				exclude: 'node_modules/**',
				extensions
			}),
			replacePlugin({
				values: {
					'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				},
				preventAssignment: true,
			}),
			resolvePlugin({ browser: false, extensions }),
			commonjsPlugin(),
			jsonPlugin(),
			pageExecution(),
			terserPlugin(true),
			userscript((meta) => meta
				.replace('process.env.AUTHOR', packageJson.author.name)
				.replace('process.env.VERSION', packageJson.version)
				.replace('process.env.LICENSE', packageJson.license)
			),
		],
		external: defineExternal(['https://esm.sh/es-module-shims']),
		output: {
			format: 'iife',
			file: 'dist/CharityFramework.user.js',
			indent: false,
			strict: false,
		},
	}
]);

function defineExternal(externals) {
	return (id) =>
		externals.some((pattern) => {
		if (typeof pattern === 'function') return pattern(id);
		if (pattern && typeof pattern.test === 'function')
			return pattern.test(id);
		if (isAbsolute(pattern))
			return !relative(pattern, resolve(id)).startsWith('..');
		return id === pattern || id.startsWith(pattern + '/');
	});
}

function pageExecution() {
	return {
		name: 'pageExecution',
		renderChunk(code) {
			// Object.defineProperty(unsafeWindow, 'charity', { configurable: false, enumerable: true, writable: false, value: cloneInto({}, unsafeWindow) });
			// Object.defineProperty(unsafeWindow.charity, 'internal', { configurable: false, enumerable: false, writable: false, value: cloneInto({}, unsafeWindow) });
			// Object.defineProperty(unsafeWindow.charity.internal, 'info', { configurable: false, enumerable: true, writable: false, value: cloneInto(GM.info.script, unsafeWindow) });
			// window.addEventListener('message', async (event) => {
			//     if (!event.data?.func?.startsWith("GM.")) return;
			//     try {
			//         const func = event.data.func.slice(3);
			//         if (typeof GM[func] !== "function") throw new Error("No such GM function: " + func);
			// 		if (func === 'xmlHttpRequest') {
			// 			const filter = (response) => Object.fromEntries(["context", "finalUrl", "lengthComputable", "loaded", "readyState", "response", "responseHeaders", "responseText", "status", "statusText", "total"].map(key => [key, response[key]]));
			// 			GM[func]({
			// 				...event.data.args[0],
			// 				onload: (response) => window.postMessage({ id: event.data.id, load: filter(response) }, event.origin),
			// 				onerror: (response) => window.postMessage({ id: event.data.id, error: filter(response) }, event.origin),
			// 				ontimeout: (response) => window.postMessage({ id: event.data.id, timeout: filter(response) }, event.origin),
			// 				onabort: (response) => window.postMessage({ id: event.data.id, abort: filter(response) }, event.origin),
			// 				onprogress: (response) => window.postMessage({ id: event.data.id, progress: filter(response) }, event.origin),
			// 				onreadystatechange: (response) => window.postMessage({ id: event.data.id, readystatechange: filter(response) }, event.origin),
			// 			});
			// 			return;
			// 		}
			//         window.postMessage({ id: event.data.id, result: await GM[func](...(event.data.args || [])) }, event.origin);
			//     } catch (err) {
			//         window.postMessage({ id: event.data.id, error: String(err) }, event.origin);
			//     }
			// });
			// const script = document.createElement("script");
			// script.textContent=`(\${(()=>{<INSERT CODE HERE>}).toString()})();`;
			// document.documentElement.appendChild(script);
			return `Object.defineProperty(unsafeWindow,"charity",{configurable:!1,enumerable:!0,writable:!1,value:cloneInto({},unsafeWindow)}),Object.defineProperty(unsafeWindow.charity,"internal",{configurable:!1,enumerable:!1,writable:!1,value:cloneInto({},unsafeWindow)}),Object.defineProperty(unsafeWindow.charity.internal,"info",{configurable:!1,enumerable:!0,writable:!1,value:cloneInto(GM.info.script,unsafeWindow)}),window.addEventListener("message",async e=>{if(e.data?.func?.startsWith("GM."))try{let f=e.data.func.slice(3);if("function"!=typeof GM[f])throw Error("No such GM function: "+f);if("xmlHttpRequest"===f){let m=r=>Object.fromEntries(["context","finalUrl","lengthComputable","loaded","readyState","response","responseHeaders","responseText","status","statusText","total"].map(k=>[k,r[k]]));GM[f]({...e.data.args[0],onload:r=>window.postMessage({id:e.data.id,load:m(r)},e.origin),onerror:r=>window.postMessage({id:e.data.id,error:m(r)},e.origin),ontimeout:r=>window.postMessage({id:e.data.id,timeout:m(r)},e.origin),onabort:r=>window.postMessage({id:e.data.id,abort:m(r)},e.origin),onprogress:r=>window.postMessage({id:e.data.id,progress:m(r)},e.origin),onreadystatechange:r=>window.postMessage({id:e.data.id,readystatechange:m(r)},e.origin)});return}window.postMessage({id:e.data.id,result:await GM[f](...e.data.args||[])},e.origin)}catch(x){window.postMessage({id:e.data.id,error:String(x)},e.origin)}});const s=document.createElement('script');s.textContent=\`(\${(()=>{${code}}).toString()})();\`;document.documentElement.appendChild(s);`
		},
	};
};
