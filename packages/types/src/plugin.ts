import { Patch } from './patch';

export interface PluginManifest {
	id: string;
	name: string;
	version: string;
	authors: string[];
	versions: {
		framework: string;
	};
}

export interface PluginDefinition {
	patches: Patch[];
	init?: (manifest: PluginManifest) => unknown;
	load?: (manifest: PluginManifest) => unknown;
}

export interface Plugin {
	manifest: PluginManifest;
	def: PluginDefinition;
}
