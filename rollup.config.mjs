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
					'process.env.AUTHOR': packageJson.author.name,
					'process.env.VERSION': packageJson.version,
					'process.env.LICENSE': packageJson.license,
					'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				},
				preventAssignment: true,
			}),
			resolvePlugin({ browser: false, extensions }),
			commonjsPlugin(),
			jsonPlugin(),
			pageExecution(),
			terserPlugin(true),
			userscript((meta) =>
				meta
			.replace('process.env.AUTHOR', packageJson.author.name)
			.replace('process.env.VERSION', packageJson.version)
			.replace('process.env.LICENSE', packageJson.license),
		),
	],
	external: defineExternal(['https://esm.sh/es-module-shims']),
	output: {
		format: 'iife',
		file: `dist/CharityFramework.user.js`,
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
			return `unsafeWindow.GM=GM;const s=document.createElement('script');s.textContent=\`(\${(()=>{const GM=window.GM;delete window.GM;${code}}).toString()})();\`;document.documentElement.appendChild(s);`
		},
	};
};
