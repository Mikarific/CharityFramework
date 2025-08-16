import { render } from 'solid-js/web';
import { DeepLinkType } from '..';
import { DeeplinkLayout } from '../components/deeplink-layout';
import styles from '../styles/deeplink.module.css';
import { getPluginStates, setPluginStates } from '../../plugins/loader';
import { Button } from '../components/button';

export function Debug() {
	return (
		<DeeplinkLayout>
			<h2 class={styles.mono}>Debugging Page</h2>
			<Button onClick={() => location.replace('/')}>Go back to wplace</Button>

			<div
				style={{
					display: 'flex',
					'flex-direction': 'column',
					gap: '6px',
				}}
				class={styles.mono}
			>
				<p>
					Version <span>v</span>
					{'process.env.VERSION'}
				</p>
				<span>Total Plugin States: {getPluginStates().length}</span>
				<span>Enabled Plugin States: {getPluginStates().filter((s) => s.enabled).length}</span>

				<div
					style={{
						display: 'flex',
						gap: '8px',
					}}
				>
					<Button buttonStyle='red' onClick={() => setPluginStates([])}>
						Clear Plugin States
					</Button>
					<Button onClick={() => setPluginStates(getPluginStates().map((s) => ({ ...s, enabled: true })))}>
						Enable all plugins
					</Button>
					<Button
						buttonStyle='red'
						onClick={() => setPluginStates(getPluginStates().map((s) => ({ ...s, enabled: false })))}
					>
						Disable all plugins
					</Button>
				</div>
			</div>
		</DeeplinkLayout>
	);
}

export default {
	id: 'debug',
	title: 'Debug',
	// executes last as a default
	condition: () => true,
	render: (root) => render(Debug, root),
} as DeepLinkType;
