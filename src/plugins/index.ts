import { Patch } from '../patches';

export interface PluginState {
	url: string;
	enabled: boolean;
	error: string | null;
}

export interface Plugin {
	id: string;
	name: string;
	version: string;
	authors: string[];
	patches: Patch[];
	versions: {
		framework: string;
	};
	load: () => void;
}
