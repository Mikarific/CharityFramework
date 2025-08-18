import { Patch } from '@placecharity/framework-types';
import { exposeGame } from './game';
import { exposeLibraries } from './libs';

export const expose = (path: string, name: string, value: string): string =>
	`Object.defineProperty(window.charity.${path},'${name}',{configurable:false,enumerable:true,writable:false,value:${value}});`;

export const exposePatches = (): Patch[] => [...exposeLibraries(), ...exposeGame()];
