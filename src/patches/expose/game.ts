import { expose } from '.';
import { Patch } from '..';
import { defineGlobalPath } from '../../utils/global';

export const exposeGame = (): Patch[] => {
	defineGlobalPath(window.WPF, 'game');
	return [
		{
			name: 'exposeGameData',
			find: 'backend.wplace.live',
			replace: {
				match: /([a-zA-Z_$][\w$]*)={[^{]*?countries:[^}]*?}.*/,
				replace: (orig, dataVar) =>
					`${orig};${expose('game', 'colors', `${dataVar}.colors`)};${expose('game', 'countries', `${dataVar}.countries`)};${expose('game', 'regionSize', `${dataVar}.regionSize`)}${expose('game', 'seasons', `${dataVar}.seasons`)}`,
			},
		},
		{
			name: 'exposeGameUser',
			find: '<span class="hidden"> </span> <!> <!>',
			replace: {
				match: /\(\)=>{([a-zA-Z_$][\w$]*)\.refresh\(\).*/,
				replace: (orig, userVar) => `${orig};${expose('game', 'user', userVar)}`,
			},
		},
		{
			name: 'exposeGameMap',
			find: 'MapLibre GL JS',
			replace: {
				match: /([a-zA-Z_$][\w$]*)=new [a-zA-Z_$][\w$]*\.Map\(.*?}\);/,
				replace: (orig, mapVar) => `${orig}${expose('game', 'map', mapVar)};`,
			},
		},
	];
};
