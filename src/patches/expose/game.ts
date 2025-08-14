import { expose } from '.';
import { Patch } from '..';
import { defineGlobalPath } from '../../utils/global';

export const exposeGame = (): Patch[] =>
	defineGlobalPath(window.WPF, 'game') && [
		{
			name: 'exposeGameData',
			find: 'backend.wplace.live',
			replace: {
				match: /([a-zA-Z_$][a-zA-Z0-9_$]*)={[^{]*?countries:[^}]*?}.*/,
				replace: (orig, dataVar) =>
					`${orig};${expose('game', 'colors', `${dataVar}.colors`)};${expose('game', 'countries', `${dataVar}.countries`)};${expose('game', 'regionSize', `${dataVar}.regionSize`)}${expose('game', 'seasons', `${dataVar}.seasons`)}`,
			},
		},
		{
			name: 'exposeGameUser',
			find: '<span class="hidden"> </span> <!> <!>',
			replace: {
				match: /\(\)=>{([a-zA-Z_$][a-zA-Z0-9_$]*)\.refresh\(\).*/,
				replace: (orig, userVar) => `${orig};${expose('game', 'user', userVar)}`,
			},
		},
		{
			name: 'exposeGameMap',
			find: 'MapLibre GL JS',
			replace: {
				match: /([a-zA-Z_$][a-zA-Z0-9_$]*)=new [a-zA-Z_$][a-zA-Z0-9_$]*\.Map\(.*?}\);/,
				replace: (orig, mapVar) => `${orig}${expose('game', 'map', mapVar)};`,
			},
		},
	];
