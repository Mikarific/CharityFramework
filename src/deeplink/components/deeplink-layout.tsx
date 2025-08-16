import { JSX } from 'solid-js/jsx-runtime';
import { logo } from '../../utils/resources';
import styles from '../styles/deeplink.module.css';

export function DeeplinkLayout({ children }: { children: JSX.Element }) {
	return (
		<>
			<img src={logo} class={styles.logo} alt='Charity Logo' />
			{children}
		</>
	);
}
