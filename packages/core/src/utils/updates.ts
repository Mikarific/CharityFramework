import semver from 'semver';
import { FrameworkManifest } from 'types/src';

const MANIFEST_URL = 'https://dist.place.charity/framework/manifest.json';

const isCurrentOutOfDate = (latest: FrameworkManifest) =>
	semver.lt(window.charity.internal.info.version, latest.version);

export async function checkForUpdates() {
	if (window.charity.internal.latestManifest) return isCurrentOutOfDate(window.charity.internal.latestManifest);
	const res = await fetch(MANIFEST_URL);

	if (!res.ok) throw new Error('framework manifest url returned status=' + res.status);
	const manifest: FrameworkManifest = await res.json();

	window.charity.internal.latestManifest = manifest;
	return isCurrentOutOfDate(manifest);
}
