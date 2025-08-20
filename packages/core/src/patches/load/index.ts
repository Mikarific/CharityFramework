import { Patch } from '@placecharity/framework-types';

async function loadPlugins() {
	for (const plugin of window.charity.internal.plugins) {
		await plugin.def.load({ manifest: plugin.manifest, utils: plugin.utils });
	}
}

export const loadPluginPatches = (): Patch[] => {
	return [
		{
			name: 'loadPlugins',
			find: 'MapLibre GL JS',
			replace: {
				match: /([a-zA-Z_$][\w$]*)=new [a-zA-Z_$][\w$]*\.Map\(.*?}\);/,
				replace: (orig, mapVar) => `${orig}${mapVar}.on('load', () => {(${loadPlugins.toString()})()});`,
			},
		},
	];
};
