import styles from '../styles/panel.module.css';
import { logo } from '../../utils/resources';

export function About() {
	return (
		<div class={styles.about}>
			<img src={logo} class={styles.logo}></img>
			<p class={styles.description}>A plugin loader for wplace.live.</p>
			<div class={styles.aboutInfo}>
				<div class={styles.version}>
					<p>Version</p>
					<p class={styles.gray}>
						<span>v</span>
						{'process.env.VERSION'}
					</p>
				</div>
				<div class={styles.author}>
					<p>Authors</p>
					<p class={styles.gray}>{'process.env.AUTHOR'}</p>
				</div>
			</div>
		</div>
	);
}
