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
		const deck = new Reveal({
			plugins: [Highlight, Notes],
			autoAnimateEasing: 'ease',
			autoAnimateDuration: 1,
			hash: true
		});
		deck.initialize().then(() => {
			const images = document.querySelectorAll<HTMLImageElement>('.reveal img');
			const pending = [...images].filter((img) => !img.complete);
			if (pending.length > 0) {
				Promise.all(
					pending.map((img) => new Promise((r) => (img.onload = img.onerror = r)))
				).then(() => deck.layout());
			}
		});
	});
</script>

<div class="reveal">
	<div class="slides">
		<Presentation />
	</div>
</div>
