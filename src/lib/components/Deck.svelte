<script lang="ts">
	import { onMount } from 'svelte';

	import Reveal from 'reveal.js';
	import Highlight from 'reveal.js/plugin/highlight/highlight';
	import Notes from 'reveal.js/plugin/notes/notes';

	import 'reveal.js/dist/reveal.css';
	import 'reveal.js/dist/theme/white.css';
	import 'highlight.js/styles/github.css';

	import Presentation from '$lib/presentation.svx';

	onMount(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const controlsParam = searchParams.get('controls');
		const progressParam = searchParams.get('progress');

		const controls = controlsParam ? controlsParam !== 'false' && controlsParam !== '0' : false;
		const progress = progressParam ? progressParam !== 'false' && progressParam !== '0' : false;

		const isMobile = window.innerWidth < 768;

		const deck = new Reveal({
			plugins: [Highlight, Notes],
			autoAnimateEasing: 'ease',
			autoAnimateDuration: 1,
			controls,
			progress,
			hash: true,
			margin: 0.04,
			minScale: 0.5,
			width: isMobile ? 480 : 960,
			height: isMobile ? 700 : 700
		});
		deck.initialize().then(() => {
			const images = document.querySelectorAll<HTMLImageElement>('.reveal img');
			const pending = [...images].filter((img) => !img.complete);
			if (pending.length > 0) {
				Promise.all(pending.map((img) => new Promise((r) => (img.onload = img.onerror = r)))).then(
					() => deck.layout()
				);
			}
		});
	});
</script>

<div class="reveal">
	<div class="slides">
		<Presentation />
	</div>
</div>
