import { DeepLinkType } from '..';

export default {
	id: 'turnstile',
	title: 'Turnstile Gen',
	condition: (url) => url.searchParams.has('turnstile'),
	render: async (root) => {
		const turnstileScript = document.createElement('script');
		turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

		document.head.appendChild(turnstileScript);

		root.innerHTML = `<div id="turnstileContainer"></div>
<textarea id="turnstileResult" onclick="this.select()" readonly></textarea>`;

		await new Promise((resolve) => setTimeout(resolve, 500));
		const castWindow = window as any;
		castWindow.turnstile.render('#turnstileContainer', {
			sitekey: '0x4AAAAAABpqJe8FO0N84q0F',
			callback: (token: string) => ((document.getElementById('turnstileResult') as HTMLTextAreaElement).value = token),
			appearance: 'execute',
		});
	},
} as DeepLinkType;
