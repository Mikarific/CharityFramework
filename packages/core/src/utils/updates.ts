import semver from 'semver';

const MANIFEST_URL = 'https://dist.place.charity/framework/manifest.json';

interface FrameworkManifest {
	version: string;
	commit: string;
}

export let isOutOfDate = true;

export async function checkForUpdates() {
	const res = await fetch(MANIFEST_URL);

	if (!res.ok) throw new Error('framework manifest url returned status=' + res.status);
	const manifest: FrameworkManifest = await res.json();

	isOutOfDate = semver.lt(window.charity.internal.info.version, manifest.version);

	return isOutOfDate;
}
