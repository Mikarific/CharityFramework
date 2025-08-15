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
							console.error('[Charity] Failed to add plugin!', err);
						}
					}}
					onMouseDown={(e) => e.stopPropagation()}
				>
					Add
				</button>
			</div>
		</div>
	);
}
