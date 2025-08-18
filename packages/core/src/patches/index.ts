import { exposePatches } from './expose';
import { trswPatches } from './trsw';
import { domEvents } from './dom';
import { loadPluginPatches } from './load';

import { Patch } from '@placecharity/framework-types';

export const builtinPatches = (): Patch[] => [
	...exposePatches(),
	...trswPatches(),
	...domEvents(),
	...loadPluginPatches(),
];
