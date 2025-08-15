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
					<p class={styles.gray}>v{GM.info.script.version}</p>
				</div>
				<div class={styles.author}>
					<p>Author</p>
					<p class={styles.gray}>{GM.info.script.author}</p>
				</div>
			</div>
		</div>
	);
}
