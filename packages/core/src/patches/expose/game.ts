import { expose } from '.';
import { Patch } from '@placecharity/framework-types';
import { defineGlobalPath } from '../../utils/global';

export const exposeGame = (): Patch[] => {
	defineGlobalPath(window.charity, 'game');
	return [
		{
			name: 'exposeInstanceMercator',
			find: 'initialResolution',
			replace: {
				match: /class ([a-zA-Z_$][\w$]*)[^}]*initialResolution[\s\S]*$/,
				replace: (orig, mercatorVar) =>
					`${orig}${expose('game', 'mercator', `new ${mercatorVar}(window.charity.data.seasons.at(-1).tileSize)`)}`,
			},
		},
		{
			name: 'exposeInstanceApi',
			find: '.pixelInfoCache.set',
			replace: {
				match: /await ([a-zA-Z_$][\w$]*)\.getPixelInfo[\s\S]*$/,
				replace: (orig, apiVar) => `${orig}${expose('game', 'api', apiVar)}`,
			},
		},
		{
			name: 'exposeInstanceUser',
			find: '.flagsBitmap.get',
			replace: {
				match: /([a-zA-Z_$][\w$]*)\.flagsBitmap\.get[\s\S]*$/,
				replace: (orig, userVar) => `${orig}${expose('game', 'user', userVar)}`,
			},
		},
		{
			name: 'exposeInstanceMap',
			find: 'styles/liberty',
			replace: {
				match: /([a-zA-Z_$][\w$]*)=new [a-zA-Z_$][\w$]*\.Map\(.*?}\);/,
				replace: (orig, mapVar) => `${orig}${expose('game', 'map', mapVar)}`,
			},
		},
		{
			name: 'exposeFunctionBoundsToCoordinates',
			find: 'initialResolution',
			replace: {
				match: /class [a-zA-Z_$][\w$]*[^}]*initialResolution.*?function ([a-zA-Z_$][\w$]*)[\s\S]*$/,
				replace: (orig, boundsToCoordinatesFunc) =>
					`${orig}${expose('game', 'boundsToCoordinates', boundsToCoordinatesFunc)}`,
			},
		},
		{
			name: 'exposeFunctionGetBoundsCenter',
			find: 'initialResolution',
			replace: {
				match: /class [a-zA-Z_$][\w$]*[^}]*initialResolution.*?function .*?function ([a-zA-Z_$][\w$]*)[\s\S]*$/,
				replace: (orig, getBoundsCenterFunc) => `${orig}${expose('game', 'getBoundsCenter', getBoundsCenterFunc)}`,
			},
		},
		{
			name: 'exposeFunctionGetMapPixel',
			find: 'Could not get 2d context from canvas',
			replace: {
				match: /function ([a-zA-Z_$][\w$]*)[^}]*\.once\("render"(?:(?!\.once\("render").)*\.triggerRepaint[\s\S]*$/,
				replace: (orig, getMapPixelFunc) => `${orig}${expose('game', 'getMapPixel', getMapPixelFunc)}`,
			},
		},
		{
			name: 'exposeFunctionGetMapImageBlob',
			find: 'Could not get 2d context from canvas',
			replace: {
				match: /function ([a-zA-Z_$][\w$]*)[^}]*\.once\("render"(?:(?!\.once\("render").)*\.toBlob[\s\S]*$/,
				replace: (orig, getMapImageBlobFunc) => `${orig}${expose('game', 'getMapImageBlob', getMapImageBlobFunc)}`,
			},
		},
	];
};
