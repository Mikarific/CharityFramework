import type * as maplibregl from 'maplibre-gl';
import type { toast } from 'svelte-sonner';
import { Plugin } from '../plugins';

declare global {
	class FlagsBitmap {
		constructor(bytes: Uint8Array);
		bytes: Uint8Array;
		set(bitIndex: number, value: boolean): void;
		get(bitIndex: number): boolean;
	}

	class User {
		constructor();
		channel: BroadcastChannel;
		data: {
			allianceId: number;
			allianceRole: 'member' | 'admin' | string;
			charges: {
				cooldownMs: number;
				count: number;
				max: number;
			};
			country: string;
			discord: string;
			droplets: number;
			equippedFlag: number;
			extraColorsBitmap: number;
			favoriteLocations: { id: number; name: string; latitude: number; longitude: number }[];
			flagsBitmap: string;
			id: number;
			isCustomer: boolean;
			level: number;
			maxFavoriteLocations: number;
			name: string;
			needsPhoneVerification: boolean;
			picture: string;
			pixelsPainted: number;
			showLastPixel: boolean;
		};
		loading: boolean;
		now: number;
		lastFetch: number;
		charges: number;
		cooldown: number;
		flagsBitmap: FlagsBitmap;
		refresh(): Promise<void>;
		logout(): Promise<void>;
		hasColor(color: number): boolean;
	}

	interface Window {
		WPF: {
			lib: {
				maplibre: typeof maplibregl;
				paraglide: {
					getLocale(): string | undefined;
					setLocale(newLocale: Locale, options?: { reload?: boolean }): void;
				};
				sonner: {
					toast: typeof toast;
				};
			};
			game: {
				colors: { name: string; rgb: [number, number, number] }[];
				countries: { id: number; name: string; code: string; flag: string };
				map: maplibregl.Map;
				regionSize: number;
				seasons: { tileSize: number; zoom: number }[];
				user: User;
			};
			plugins: Plugin[];
			registerPlugin: (plugin: Plugin) => {};
		};
		esmsInitOptions?: {
			shimMode?: boolean;
			nativePassthrough?: boolean;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			source?: (...args: any[]) => any;
		};
	}
}

export {};
