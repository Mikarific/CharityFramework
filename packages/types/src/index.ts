import maplibregl from 'maplibre-gl';
import { toast } from 'svelte-sonner';
import { Plugin } from './plugin';
import {
	AllianceBannedMember,
	AllianceData,
	AllianceLeaderboardEntry,
	AllianceMember,
	Bounds,
	LeaderboardCountryEntry,
	LeaderboardEntry,
	LeaderboardPeriod,
	LeaderboardPlayerEntry,
	LeaderboardRegionAllianceEntry,
	LeaderboardRegionEntry,
	UserData,
} from './game';

export * from './game';
export * from './patch';
export * from './plugin';

declare global {
	class Bitmap {
		constructor(bytes: Uint8Array);
		private bytes: Uint8Array;
		set(n: number, value: boolean): void;
		get(n: number): boolean;
	}

	class API {
		constructor(url: string);
		online: boolean;
		paint(
			input: { tile: [number, number]; pixel: [number, number]; season: number; colorIdx: number }[],
			token: string,
		): Promise<void>;
		getPixelInfo({
			season,
			tile: [tx, ty],
			pixel: [px, py],
		}: {
			season: number;
			tile: [number, number];
			pixel: [number, number];
		}): Promise<{
			paintedBy: {
				id: number;
				name: string;
				allianceId: number;
				allianceName: string;
				equippedFlag: number;
				picture?: string;
				discord?: string;
			};
			region: { id: number; cityId: number; name: string; number: number; countryId: number };
		}>;
		me(): Promise<UserData | undefined>;
		logout(): Promise<UserData>;
		refreshPaymentSession(sessionId: string): Promise<boolean>;
		getOtpCooldown(): Promise<{ cooldownMs: number }>;
		sendOtp(phone: string): Promise<{ cooldownMs: number; phone: string }>;
		verifyOtp(code: string): Promise<{ phone: string }>;
		updateMe(input: { name: string; showLastPixel: boolean; discord: string }): Promise<void>;
		deleteMe(): Promise<void>;
		favoriteLocation(latLon: [number, number]): Promise<void>;
		deleteFavoriteLocation(id: number): Promise<void>;
		updateFavoriteLocation(id: number, name: number): Promise<void>;
		leaderboardPlayers(period: LeaderboardPeriod): Promise<LeaderboardPlayerEntry[]>;
		leaderboardAlliances(period: LeaderboardPeriod): Promise<LeaderboardEntry[]>;
		leaderboardRegions(period: LeaderboardPeriod, countryId?: number): Promise<LeaderboardRegionEntry[]>;
		leaderboardRegionPlayers(regionId: number, period: LeaderboardPeriod): Promise<LeaderboardPlayerEntry[]>;
		leaderboardRegionAlliances(regionId: number, period: LeaderboardPeriod): Promise<LeaderboardRegionAllianceEntry[]>;
		leaderboardCountries(period: LeaderboardPeriod): Promise<LeaderboardCountryEntry[]>;
		getRandomTile(season: number): Promise<{ tile: { x: number; y: number }; pixel: { x: number; y: number } }>;
		purchase(product: { id: number; amount: number; variant?: number }): Promise<void>;
		getAlliance(): Promise<AllianceData | undefined>;
		createAlliance(name: string): Promise<{ id: number }>;
		leaveAlliance(): Promise<void>;
		updateAllianceDescription(description: string): Promise<void>;
		updateAllianceHeadquarters(latitude: number, longitude: number): Promise<void>;
		allianceLeaderboard(period: LeaderboardPeriod): Promise<AllianceLeaderboardEntry[]>;
		getAllianceInvites(): Promise<string[]>;
		joinAlliance(
			inviteId: string,
		): Promise<'success' | 'invalid-invite' | 'not-logged-in' | 'banned' | 'in-another-alliance' | 'error'>;
		getAllianceMembers(page: number): Promise<{ data: AllianceMember[]; hasNext: boolean }>;
		getAllianceBannedMembers(page: number): Promise<{ data: AllianceBannedMember[]; hasNext: boolean }>;
		giveAllianceAdmin(toUserId: number): Promise<void>;
		banAllianceUser(userId: number): Promise<void>;
		equipFlag(flagId: number): Promise<void>;
		getMyProfilePictures(): Promise<{ id: number; url: string }[]>;
		changeProfilePicture(pictureId?: number): Promise<void>;
		unbanAllianceUser(userId: number): Promise<void>;
		health(): Promise<{ up: boolean; uptime: string; database: boolean }>;
		generatePixQrCode(
			productId: number,
		): Promise<{ qrCode: string; pixCode: string; pixId: string; price: number; productId: number }>;
		refreshPixPayment(pixId: string): Promise<{ paid: boolean }>;
		getPixStatus(pixId: string): Promise<{ paid: boolean }>;
		request(path: string, init?: RequestInit): Promise<Response>;
	}

	class Mercator {
		constructor(tileSize?: number);
		public readonly initialResolution: number;
		latLonToMeters(lat: number, lon: number): [number, number];
		metersToLatLon(mx: number, my: number): [number, number];
		pixelsToMeters(px: number, py: number, zoom: number): [number, number];
		pixelsToLatLon(px: number, py: number, zoom: number): [number, number];
		latLonToPixels(lat: number, lon: number, zoom: number): [number, number];
		latLonToPixelsFloor(lat: number, lon: number, zoom: number): [number, number];
		metersToPixels(mx: number, my: number, zoom: number): [number, number];
		latLonToTile(lat: number, lon: number, zoom: number): [number, number];
		metersToTile(mx: number, my: number, zoom: number): [number, number];
		pixelsToTile(px: number, py: number): [number, number];
		pixelsToTileLocal(px: number, py: number): { tile: [number, number]; pixel: [number, number] };
		tileBounds(tx: number, ty: number, zoom: number): Bounds;
		tileBoundsLatLon(tx: number, ty: number, zoom: number): Bounds;
		resolution(zoom: number): number;
		latLonToTileAndPixel(lat: number, lon: number, zoom: number): { tile: [number, number]; pixel: [number, number] };
		pixelBounds(px: number, py: number, zoom: number): Bounds;
		pixelToBoundsLatLon(px: number, py: number, zoom: number): Bounds;
		latLonToTileBoundsLatLon(lat: number, lon: number, zoom: number): Bounds;
		latLonToPixelBoundsLatLon(lat: number, lon: number, zoom: number): Bounds;
		latLonToRegionAndPixel(lat: number, lon: number, zoom: number, regionSize?: number): Bounds;
	}

	class User {
		constructor();
		private channel: BroadcastChannel;
		data: UserData | undefined;
		loading: boolean;
		private now: number;
		private lastFetch: number;
		readonly charges: number | undefined;
		readonly cooldown: number | undefined;
		flagsBitmap: Bitmap;
		refresh(): Promise<void>;
		logout(): Promise<void>;
		hasColor(idx: number): boolean;
	}

	interface Window {
		charity: {
			classes: {
				API: typeof API;
				Mercator: typeof Mercator;
				User: typeof User;
			};
			data: {
				audio: {
					plop: HTMLAudioElement;
					smallPlop: HTMLAudioElement;
					bigPlop: HTMLAudioElement;
					smallDropplet: HTMLAudioElement;
					droppletAndPlop: HTMLAudioElement;
					notification1: HTMLAudioElement;
				};
				colors: { name: string; rgb: [number, number, number] }[];
				countries: { id: number; name: string; code: string; flag: string };
				currentSeason: number;
				errors: { [key: string]: string };
				items: {
					Droplet: Record<never, never>;
					'Max. Charge': Record<never, never>;
					'Paint Charge': Record<never, never>;
					Color: Record<never, never>;
					Flag: Record<never, never>;
					'Profile Picture': Record<never, never>;
				};
				products: {
					[key: number]: {
						name: string;
						price: number;
						isDollar: boolean;
						lookupKey: string;
						items: { name: string; amount: number }[];
					};
				};
				refreshIntervalMs: number;
				regionSize: number;
				seasons: { tileSize: number; zoom: number }[];
				tileSize: number;
				zoom: number;
			};
			game: {
				api: API;
				boundsToCoordinates(
					bounds: Bounds,
					swapCoords?: boolean,
				): [[number, number], [number, number], [number, number], [number, number]];
				getBoundsCenter(bounds: Bounds): [number, number];
				getMapImageBlob(
					map: maplibregl.Map,
					options?: { quality?: number; type?: 'image/png' | 'image/jpeg'; maxWidth?: number; maxHeight?: number },
				): Promise<Blob>;
				getMapPixel(map: maplibregl.Map, x: number, y: number): Promise<[number, number, number, number]>;
				map: maplibregl.Map;
				mercator: Mercator;
				user: User;
			};
			lib: {
				maplibre: typeof maplibregl;
				paraglide: {
					getLocale(): string | undefined;
					setLocale(newLocale: string, options?: { reload?: boolean }): void;
				};
				sonner: { toast: typeof toast };
			};
			internal: {
				info: {
					name: string | null;
					description: string | null;
					version: string | null;
					author: string | null;
					license: string | null;
					homepage: string | null;
					supportURL: string | null;
					downloadURL: string | null;
					updateURL: string | null;
					contributionURL: string | null;
				};
				currentUrlOverride: string;
				plugins: Plugin[];
			};
		};
	}
}
