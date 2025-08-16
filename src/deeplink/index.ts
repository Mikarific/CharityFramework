import addPluginType from './types/add-plugin';
import debugType from './types/debug';
import { stylesheet, default as styles } from './styles/deeplink.module.css';
const DEEPLINK_PATH = '/charity';
const DEEPLINK_APP_SHELL = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ DEEPLINK_TYPE_TITLE }} - Charity</title>
</head>
<body>
    <charity-root id="deeplinkRoot" class="${styles.root}"></charity-root>
</body>
`;

const DEEPLINK_TYPES: DeepLinkType[] = [addPluginType, debugType];

export interface DeepLinkType {
	id: string;
	title: string;
	condition: (url: URL) => boolean;
	render: (root: HTMLElement) => unknown;
}

export function executeDeepLink(): boolean {
	if (!window.location.pathname.startsWith(DEEPLINK_PATH)) return false;

	const url = new URL(window.location.href);
	for (const type of DEEPLINK_TYPES) {
		if (!type.condition(url)) continue;

		console.log('[Charity]', 'stopping execution and rendering deeplink type', type.id);
		const shell = DEEPLINK_APP_SHELL.replaceAll('{{ DEEPLINK_TYPE_TITLE }}', type.title);
		document.querySelector('html').innerHTML = shell;

		document.addEventListener('DOMContentLoaded', () => {
			const styleElement = document.createElement('style');
			styleElement.setAttribute('type', 'text/css');
			styleElement.textContent = stylesheet;
			document.head.appendChild(styleElement);
			type.render(document.getElementById('deeplinkRoot'));
		});

		return true;
	}

	return false;
}
