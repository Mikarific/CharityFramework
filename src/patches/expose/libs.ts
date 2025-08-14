import { expose } from '.';
import { Patch } from '..';
import { defineGlobalPath } from '../../utils/global';

export const exposeLibraries = (): Patch[] => {
	defineGlobalPath(window.WPF, 'lib');

	defineGlobalPath(window.WPF.lib, 'paraglide');
	return [
		// paraglide
		{
			name: 'exposeParaglideGetLocale',
			find: '__paraglide',
			replace: {
				match: /([a-zA-Z_$][a-zA-Z0-9_$]*)=\(\)=>.*getLocale\(\);.*/,
				replace: (orig, funName) => `${orig};${expose('lib.paraglide', 'getLocale', funName)}`,
			},
		},
		{
			name: 'exposeParaglideSetLocale',
			find: '__paraglide',
			replace: {
				match: /([a-zA-Z_$][a-zA-Z0-9_$]*)=\([^)]*,[^)]*\)=>.*setLocale.*/,
				replace: (orig, funName) => `${orig};${expose('lib.paraglide', 'setLocale', funName)}`,
			},
		},
		// sonner
		{
			name: 'exposeSonner',
			find: 'backend.wplace.live',
			replace: {
				match: /([a-zA-Z_$][a-zA-Z0-9_$]*)=Object\.assign.*?getActiveToasts.*/,
				replace: (orig, sonnerVar) => `${orig};${expose('lib', 'sonner', sonnerVar)}`,
			},
		},
		// maplibre
		{
			name: 'exposeMapLibre',
			find: 'MapLibre GL JS',
			replace: {
				match: /new ([a-zA-Z_$][a-zA-Z0-9_$]*)\.Map\(.*?}\);/,
				replace: (orig, mapLibreVar) => `${orig}${expose('lib', 'maplibre', mapLibreVar)};`,
			},
		},
	];
};
