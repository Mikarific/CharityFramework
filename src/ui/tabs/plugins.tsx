import { For } from 'solid-js';

import { addPlugin } from '../../plugins/loader';
import styles from '../styles/panel.module.css';

let input: HTMLInputElement;

export function Plugins() {
	return (
		<div class={styles.plugins}>
			<div class={styles.addPlugin}>
				<input
					ref={input}
					type='text'
					placeholder='Enter plugin URL here...'
					onMouseDown={(e) => e.stopPropagation()}
				/>
				<button
					onClick={async () => {
						try {
							await addPlugin(input.value);
						} catch (err) {
							console.error('[Charity]', err);
						}
					}}
					onMouseDown={(e) => e.stopPropagation()}
				>
					Add
				</button>
			</div>
			<div>
				<For each={window.charity.internal.plugins}>
					{(plugin) => {
						return (
							<div class={styles.plugin}>
								<div class={styles.pluginName}>
									{plugin.manifest.name}&nbsp;<span class={styles.gray}>by {plugin.manifest.authors.join(', ')}</span>
								</div>
								<button onMouseDown={(e) => e.stopPropagation()}>Remove</button>
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}
