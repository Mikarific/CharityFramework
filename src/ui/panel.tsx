import { render } from 'solid-js/web';
import { createSignal, Show } from 'solid-js';

import styles from './styles/panel.module.css';
import { Plugins } from './tabs/plugins';
import { About } from './tabs/about';

let wrapper: HTMLDivElement;
let body: HTMLDivElement;

function Panel() {
	const [getTab, setTab] = createSignal<'about' | 'plugins'>('about');
	return (
		<div ref={wrapper} class={styles.wrapper} onMouseDown={drag}>
			<div ref={body} class={styles.body}>
				<nav class={styles.nav}>
					<a
						style={getTab() === 'about' ? 'text-decoration: underline' : ''}
						onClick={() => setTab('about')}
						onMouseDown={(e) => e.stopPropagation()}
					>
						About
					</a>
					<a
						style={getTab() === 'plugins' ? 'text-decoration: underline' : ''}
						onClick={() => setTab('plugins')}
						onMouseDown={(e) => e.stopPropagation()}
					>
						Plugins
					</a>
				</nav>
				<Show when={getTab() === 'about'}>
					<About />
				</Show>
				<Show when={getTab() === 'plugins'}>
					<Plugins />
				</Show>
			</div>
		</div>
	);
}

export function createPanel(parent: Node) {
	render(Panel, parent);
}

export function showPanel() {
	const { width, height } = wrapper.getBoundingClientRect();
	const x = window.innerWidth / 2 - width / 2;
	const y = window.innerHeight / 2 - height / 2;
	wrapper.style.inset = `${y}px auto auto ${x}px`;
}

let dragging: { x: number; y: number } = null;
function drag(event: MouseEvent) {
	const onMouseMove = (event: MouseEvent) => {
		if (dragging === null) return;
		const width = document.documentElement.clientWidth - wrapper.offsetWidth;
		const height = document.documentElement.clientHeight - wrapper.offsetHeight;
		const left = Math.min(width, Math.max(0, event.clientX - dragging.x));
		const top = Math.min(height, Math.max(0, event.clientY - dragging.y));
		const position = { top: top + 'px', left: left + 'px', right: 'auto', bottom: 'auto' };
		Object.assign(wrapper.style, position);
	};

	const onMouseUp = () => {
		dragging = null;
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
		wrapper.classList.remove(styles.grabbing);
	};

	event.preventDefault();
	event.stopPropagation();
	const { x, y } = wrapper.getBoundingClientRect();
	dragging = { x: event.clientX - x, y: event.clientY - y };
	wrapper.classList.add(styles.grabbing);
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
}
