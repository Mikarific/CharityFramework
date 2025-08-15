import styles from '../styles/panel.module.css';
import { PluginState } from '../../plugins';

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
					onClick={() => {
						const plugins: PluginState[] = JSON.parse(localStorage.getItem('charity.plugins'));
						plugins.push({
							url: input.value,
							enabled: true,
							error: null,
						});
						localStorage.setItem('charity.plugins', JSON.stringify(plugins));
						location.reload();
					}}
					onMouseDown={(e) => e.stopPropagation()}
				>
					Add
				</button>
			</div>
		</div>
	);
}
