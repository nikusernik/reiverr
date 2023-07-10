import type { Genre } from '$lib/apis/tmdbApi';
import { writable } from 'svelte/store';

export function formatMinutesToTime(minutes: number) {
	const days = Math.floor(minutes / 60 / 24);
	const hours = Math.floor((minutes / 60) % 24);
	const minutesLeft = Math.floor(minutes % 60);

	return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${
		days > 0 ? '' : minutesLeft + 'min'
	}`;
}

export function formatGenres(genres: Genre[]) {
	return genres.map((genre) => genre.name.charAt(0).toUpperCase() + genre.name.slice(1)).join(', ');
}

export function formatSize(size: number) {
	const gbs = size / 1024 / 1024 / 1024;
	const mbs = size / 1024 / 1024;

	if (gbs >= 1) {
		return `${gbs.toFixed(2)} GB`;
	} else {
		return `${mbs.toFixed(2)} MB`;
	}
}

export function request<R, A>(fetcher: (arg: A) => Promise<R>, args: A | undefined = undefined) {
	const loading = writable(args !== undefined);
	const error = writable<Error | null>(null);
	const data = writable<R | null>(null);
	const didLoad = writable(false);

	async function load(arg: A) {
		loading.set(true);
		error.set(null);

		fetcher(arg)
			.then((d) => {
				// if (typeof window !== undefined) console.log('request data', d);
				data.set(d);
			})
			.catch((e) => error.set(e))
			.finally(() => {
				loading.set(false);
				didLoad.set(true);
			});
	}

	if (args !== undefined) {
		load(args);
	}

	return {
		loading,
		error,
		data,
		didLoad,
		load
	};
}

export const getFadeIndex = () => {
	const obj: any = {
		index: -1
	};

	function getNext() {
		return ++obj.index;
	}

	obj.getNextFadeIndex = getNext;

	return obj;
};

export function log(arg: any) {
	console.log('LOGGER', arg);
	return arg;
}