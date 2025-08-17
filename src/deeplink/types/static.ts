import { DeepLinkType } from '..';

export default {
	id: 'static',
	title: 'Static Page',
	condition: (url) => url.searchParams.has('static'),
	render: async () => {
		const url = 'https://waiting-room.place.charity/index.html';
		window.charity.internal.currentUrlOverride = url;
		const indexRes = await fetch(url);

		const newHtml = await indexRes.text();

		document.querySelector('html').innerHTML = newHtml;
		eval((document.querySelector('body > div > script') as HTMLScriptElement).innerText);
		return false;
	},
} as DeepLinkType;
