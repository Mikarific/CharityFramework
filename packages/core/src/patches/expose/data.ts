import { expose } from '.';
import { Patch } from '@placecharity/framework-types';

export const exposeData = (): Patch[] => {
	return [
		{
			name: 'exposeAudio',
			find: '.plop.play()',
			replace: {
				match: /([a-zA-Z_$][\w$]*)\.plop\.play\(\)[\s\S]*$/,
				replace: (orig, audioVar) => `${orig}${expose('data', 'audio', audioVar)}`,
			},
		},
		{
			name: 'exposeData',
			find: '.seasons.length',
			replace: {
				match: /([a-zA-Z_$][\w$]*)={[^{]*?seasons:[^}]*?}[\s\S]*$/,
				replace: (orig, dataVar) =>
					`${orig}${expose('', 'data', `${dataVar}`)}${expose('data', 'currentSeason', `${dataVar}.seasons.length-1`)}${expose('data', 'zoom', `${dataVar}.seasons[window.charity.data.currentSeason].zoom`)}${expose('data', 'tileSize', `${dataVar}.seasons[window.charity.data.currentSeason].tileSize`)}`,
			},
		},
	];
};
