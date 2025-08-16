import { createEffect, createSignal, Show } from 'solid-js';
import { DeepLinkType } from '..';
import { fetchManifest, PluginManifest } from '../../plugins';
import { DeeplinkLayout } from '../components/deeplink-layout';
import styles from '../styles/deeplink.module.css';
import { render } from 'solid-js/web';
import { Button } from '../components/button';
import { addPlugin, getPluginStates, removePlugin } from '../../plugins/loader';

export function AddPlugin() {
	const pluginUrl = new URL(window.location.href).searchParams.get('plugin');
	const [getManifest, setManifest] = createSignal<PluginManifest | null>(null);
	const [hasError, setError] = createSignal(false);
	const [isAlreadyInstalled, setAlreadyInstalled] = createSignal(false);

	createEffect(() => {
		fetchManifest(pluginUrl)
			.then((m) => {
				setManifest(m);
				setAlreadyInstalled(!!getPluginStates().find((s) => s.id === m.id || s.url === pluginUrl));
			})
			.catch((error) => {
				console.error('[Charity] error while fetching manifest for deeplink', error);
				setError(true);
			});
	});

	return (
		<DeeplinkLayout>
			<h2 class={styles.pixel}>Add Plugin</h2>
			<Show when={!getManifest() && !hasError()}>
				<h2 class={styles.pixel}>Loading...</h2>
			</Show>
			<Show when={hasError()}>
				<p
					style={{
						color: '#f87171',
					}}
					class={styles.pixel}
				>
					An error occured while loading plugin manifest, please make sure this is a valid link or check the console.
				</p>
				<Button class={styles.pixel} buttonStyle='red' onClick={() => window.location.replace('/')}>
					Cancel
				</Button>
			</Show>
			<Show when={isAlreadyInstalled()}>
				<p
					style={{
						color: '#f87171',
					}}
					class={styles.pixel}
				>
					You already have this plugin installed.
				</p>
				<Button
					class={styles.pixel}
					buttonStyle='red'
					onClick={() => {
						removePlugin(getManifest().id);
						window.location.replace('/');
					}}
				>
					Remove
				</Button>
			</Show>

			<Show when={getManifest() && !hasError() && !isAlreadyInstalled()}>
				<p class={styles.pixel}>
					Are you sure you want to install <span class={styles.gray}>{getManifest().name}</span> by{' '}
					<span class={styles.gray}>{getManifest().authors.join(',, ')}</span> from {pluginUrl}?
				</p>
				<div
					style={{
						display: 'flex',
						gap: '8px',
					}}
				>
					<Button
						onClick={() =>
							addPlugin(pluginUrl)
								.then(() => window.location.replace('/'))
								.catch((error) => {
									setError(true);
									console.error('[Charity]', error);
								})
						}
						buttonStyle='green'
						class={styles.pixel}
					>
						Add
					</Button>
					<Button class={styles.pixel} buttonStyle='red' onClick={() => window.location.replace('/')}>
						Cancel
					</Button>
				</div>
			</Show>
		</DeeplinkLayout>
	);
}

export default {
	id: 'addPlugin',
	title: 'Add Plugin',
	condition: (url) => url.searchParams.has('plugin'),
	render: (root) => render(AddPlugin, root),
} as DeepLinkType;
