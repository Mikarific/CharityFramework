import { exposePatches } from './expose';
import { trswPatches } from './trsw';
import { domEvents } from './dom';

export interface Patch {
	name: string;
	find: string;
	disable?: boolean;
	replace: {
		match: RegExp | string;
		replace: (substring: string, ...args: string[]) => string;
	};
}

export const builtinPatches = (): Patch[] => [...exposePatches(), ...trswPatches(), ...domEvents()];
