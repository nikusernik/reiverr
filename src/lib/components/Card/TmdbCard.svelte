<script lang="ts">
	import Card from './Card.svelte';
	import type { TmdbMovie2, TmdbSeries2 } from '../../apis/tmdb/tmdb-api';
	import type { ComponentProps } from 'svelte';
	import { TMDB_POSTER_SMALL } from '../../constants';
	import type { TitleType } from '../../types';

	export let item: TmdbMovie2 | TmdbSeries2;
	let title = '';
	let subtitle = '';
	let type: TitleType = 'movie';

	if ('title' in item) {
		title = item.title || title;
		subtitle = item.release_date || subtitle;
		type = 'movie';
	} else if ('name' in item) {
		title = item.name || title;
		subtitle = item.first_air_date || subtitle;
		type = 'series';
	}

	const props: ComponentProps<Card> = {
		tmdbId: item.id,
		title,
		subtitle,
		backdropUrl: TMDB_POSTER_SMALL + item.poster_path,
		type,
		orientation: 'portrait',
		rating: item.vote_average,
		size: 'lg'
	};
</script>

<Card {...$$restProps} {...props} on:enter />
