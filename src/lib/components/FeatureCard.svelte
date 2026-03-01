<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		icon
	}: {
		title: string;
		description: string;
		icon: Snippet;
	} = $props();
</script>

<div class="flex w-full items-start gap-3 rounded-md bg-[#e5e5e5] p-4 text-left shadow-md">
	<div class="shrink-0 text-black/35">
		{@render icon()}
	</div>
	<div>
		<div class="text-sm font-bold text-black">{title}</div>
		<div class="mt-0.5 text-xs font-light text-black/60">{description}</div>
	</div>
</div>
