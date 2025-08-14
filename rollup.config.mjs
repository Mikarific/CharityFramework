import { isAbsolute, relative, resolve } from 'path';
import { defineConfig } from 'rollup';

import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import userscript from 'rollup-plugin-userscript';

import { readPackageUp } from 'read-package-up';
const { packageJson } = await readPackageUp();

export default defineConfig([
	{
		input: 'src/index.ts',
		plugins: [
			replacePlugin({
				values: {
					'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				},
				preventAssignment: true,
			}),
			resolvePlugin({ browser: false, extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'] }),
			commonjsPlugin(),
			jsonPlugin(),
			typescript(),
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
		file: `dist/WPlaceFramework.user.js`,
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
