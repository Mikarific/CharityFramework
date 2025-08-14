import { Patch } from '..';
import { exposeGame } from './game';
import { exposeLibraries } from './libs';

export const expose = (path: string, name: string, value: string): string =>
	`Object.defineProperty(window.WPF.${path},'${name}',{configurable:false,enumerable:true,writable:false,value:${value}});`;

export const exposePatches = (): Patch[] => [...exposeLibraries(), ...exposeGame()];
