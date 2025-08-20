/// <reference types="@violentmonkey/types" />

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

export interface PluginUtils {
	getValue: typeof GM.getValue;
	setValue: typeof GM.setValue;
	deleteValue: typeof GM.deleteValue;
	listValues: typeof GM.listValues;
	fetchWithoutCORS: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export interface PluginDefinition {
	patches: Patch[];
	init?: (plugin: PluginInfo) => unknown;
	load?: (plugin: PluginInfo) => unknown;
}

export interface Plugin {
	manifest: PluginManifest;
	def: PluginDefinition;
	utils: PluginUtils;
}

export interface PluginInfo {
	manifest: PluginManifest;
	utils: PluginUtils;
}
