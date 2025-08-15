import { Patch } from '../patches';

export interface Plugin {
	id: string;
	name: string;
	version: string;
	authors: string[];
	patches: Patch[];
	load: () => void;
}
