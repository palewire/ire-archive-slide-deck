<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id = null,
		animate = false,
		restart = false,
		children
	}: {
		id?: string | null;
		animate?: boolean;
		restart?: boolean;
		children: Snippet;
	} = $props();
</script>

<section
	data-auto-animate-id={id}
	data-auto-animate={animate || null}
	data-auto-animate-restart={restart || null}
	class="prose max-w-none"
>
	{@render children()}
</section>
