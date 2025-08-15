import { createIcon } from './icon';
import { createPanel } from './panel';

import { stylesheet as panelCss } from './styles/panel.module.css';

export function init() {
	document.addEventListener('wpf-right-sidebar', (sidebar: CustomEvent) => createIcon(sidebar.detail));

	const host = document.createElement('wpf-' + Math.random().toString(36).slice(2, 8));
	const shadowRoot = host.attachShadow({ mode: 'open' });

	const panelStyles = document.createElement('style');
	panelStyles.setAttribute('type', 'text/css');
	panelStyles.textContent = panelCss;
	shadowRoot.append(panelStyles);

	createPanel(shadowRoot);
	document.body.appendChild(host);

	const { width, height } = host.getBoundingClientRect();
	const x = window.innerWidth / 2 - width / 2;
	const y = window.innerHeight / 2 - height / 2;
	host.style.inset = `${y}px auto auto ${x}px`;
}
