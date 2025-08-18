import { expose } from '.';
import { Patch } from '@placecharity/framework-types';
import { defineGlobalPath } from '../../utils/global';

export const exposeLibraries = (): Patch[] => {
	defineGlobalPath(window.charity, 'lib');

	defineGlobalPath(window.charity.lib, 'paraglide');
	defineGlobalPath(window.charity.lib, 'sonner');
	return [
		// paraglide
		{
			name: 'exposeParaglideGetLocale',
			find: '__paraglide',
			replace: {
				match: /([a-zA-Z_$][\w$]*)=\(\)=>.*getLocale\(\);.*/,
				replace: (orig, funName) => `${orig};${expose('lib.paraglide', 'getLocale', funName)}`,
			},
		},
		{
			name: 'exposeParaglideSetLocale',
			find: '__paraglide',
			replace: {
				match: /([a-zA-Z_$][\w$]*)=\([^)]*,[^)]*\)=>.*setLocale.*/,
				replace: (orig, funName) => `${orig};${expose('lib.paraglide', 'setLocale', funName)}`,
			},
		},
		// sonner
		{
			name: 'exposeSonner',
			find: 'backend.wplace.live',
			replace: {
				match: /([a-zA-Z_$][\w$]*)=Object\.assign.*?getActiveToasts.*/,
				replace: (orig, sonnerVar) => `${orig};${expose('lib.sonner', 'toast', sonnerVar)}`,
			},
		},
		// maplibre
		{
			name: 'exposeMapLibre',
			find: 'MapLibre GL JS',
			replace: {
				match: /new ([a-zA-Z_$][\w$]*)\.Map\(.*?}\);/,
				replace: (orig, mapLibreVar) => `${orig}${expose('lib', 'maplibre', mapLibreVar)}`,
			},
		},
	];
};
