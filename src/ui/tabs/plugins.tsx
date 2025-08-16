import { For } from 'solid-js';

import { addPlugin, getPluginStates, removePlugin } from '../../plugins/loader';
import styles from '../styles/panel.module.css';

let input: HTMLInputElement;

export function Plugins() {
	const brokenPlugins = getPluginStates().filter((s) => s.enabled && s.error);

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
				<For each={brokenPlugins}>
					{(brokenPlugin) => (
						<div class={styles.plugin}>
							<div class={`${styles.pluginName} ${styles.brokenPlugin}`}>
								<span class={styles.gray}>{brokenPlugin.id}</span>&nbsp;
								<span class={styles.red}>is broken, refresh and check console for error</span>
							</div>
							<button
								onClick={() => {
									removePlugin(brokenPlugin.id);
								}}
								onMouseDown={(e) => e.stopPropagation()}
							>
								Remove
							</button>
						</div>
					)}
				</For>
				<For each={window.charity.internal.plugins}>
					{(plugin) => {
						return (
							<div class={styles.plugin}>
								<div class={styles.pluginName}>
									{plugin.manifest.name}&nbsp;<span class={styles.gray}>by {plugin.manifest.authors.join(', ')}</span>
								</div>
								<button
									onClick={() => {
										removePlugin(plugin.manifest.id);
									}}
									onMouseDown={(e) => e.stopPropagation()}
								>
									Remove
								</button>
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}
