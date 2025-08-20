import { Patch } from '@placecharity/framework-types';
import { getUtils } from 'core/src/utils/gm';

async function loadPlugins() {
	for (const plugin of window.charity.internal.plugins) {
		await plugin.def.load({
			manifest: plugin.manifest,
			utils: getUtils(plugin.manifest.id),
		});
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
