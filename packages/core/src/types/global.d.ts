import type * as maplibregl from 'maplibre-gl';
import type { toast } from 'svelte-sonner';
import { Plugin } from '../plugins';

declare global {
	interface Window {
		esmsInitOptions?: {
			shimMode?: boolean;
			nativePassthrough?: boolean;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			source?: (...args: any[]) => any;
		};
	}

	declare var process: {
		env: {
			NODE_ENV: string;
		};
	};
}

export {};
