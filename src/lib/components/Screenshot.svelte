<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		url = '',
		children
	}: {
		url?: string;
		children: Snippet;
	} = $props();
</script>

<div class="screenshot not-prose mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-200 shadow-lg">
	<!-- Title bar -->
	<div class="flex items-center gap-2 bg-gray-100 px-4 py-2">
		<div class="flex gap-1.5">
			<div class="size-3 rounded-full bg-[#ff5f57]"></div>
			<div class="size-3 rounded-full bg-[#ffbd2e]"></div>
			<div class="size-3 rounded-full bg-[#28c840]"></div>
		</div>
		{#if url}
			<div class="mx-2 flex-1">
				<div class="truncate rounded bg-white px-3 py-1 text-center text-xs text-gray-400">
					{url}
				</div>
			</div>
		{/if}
	</div>
	<!-- Content -->
	<div class="children overflow-hidden bg-white">
		{@render children()}
	</div>
</div>

<style>
	.screenshot {
		margin-top: 1.125rem;
		max-width: 80%;
	}
	.children {
		max-height: 500px;
	}
</style>
