<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	interface Resource {
		category: string;
		count: number;
	}

	interface TreeRoot {
		children: Resource[];
	}

	const data: Resource[] = [
		{ category: 'Contest entries', count: 25310 },
		{ category: 'Tipsheets', count: 6115 },
		{ category: 'Audio', count: 1799 },
		{ category: 'Journals', count: 124 },
		{ category: 'Webinars', count: 51 },
		{ category: 'Datasets', count: 50 }
	];

	const grays = ['#eee', '#e5e5e5', '#ddd', '#ccc', '#bbb', '#aaa'];

	let container: HTMLDivElement;

	onMount(() => {
		const width = 880;
		const height = 440;
		const padding = 3;

		const root = d3
			.hierarchy<TreeRoot | Resource>({ children: data } as TreeRoot)
			.sum((d) => ('count' in d ? d.count : 0))
			.sort((a, b) => (b.value || 0) - (a.value || 0));

		const treemap = d3
			.treemap<TreeRoot | Resource>()
			.size([width, height])
			.padding(padding)
			.round(true);

		treemap(root);

		const leaves = root.leaves() as d3.HierarchyRectangularNode<TreeRoot | Resource>[];

		const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);

		const defs = svg.append('defs');

		// Diagonal lines
		defs
			.append('pattern')
			.attr('id', 'pat-diag')
			.attr('width', 8)
			.attr('height', 8)
			.attr('patternUnits', 'userSpaceOnUse')
			.attr('patternTransform', 'rotate(45)')
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 8)
			.attr('stroke', 'rgba(0,0,0,0.08)')
			.attr('stroke-width', 2);

		// Dots
		defs
			.append('pattern')
			.attr('id', 'pat-dots')
			.attr('width', 10)
			.attr('height', 10)
			.attr('patternUnits', 'userSpaceOnUse')
			.append('circle')
			.attr('cx', 5)
			.attr('cy', 5)
			.attr('r', 1.5)
			.attr('fill', 'rgba(0,0,0,0.1)');

		// Crosshatch
		const cross = defs
			.append('pattern')
			.attr('id', 'pat-cross')
			.attr('width', 8)
			.attr('height', 8)
			.attr('patternUnits', 'userSpaceOnUse');
		cross
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 8)
			.attr('y2', 8)
			.attr('stroke', 'rgba(0,0,0,0.07)')
			.attr('stroke-width', 1);
		cross
			.append('line')
			.attr('x1', 8)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 8)
			.attr('stroke', 'rgba(0,0,0,0.07)')
			.attr('stroke-width', 1);

		// Horizontal lines
		defs
			.append('pattern')
			.attr('id', 'pat-horiz')
			.attr('width', 6)
			.attr('height', 6)
			.attr('patternUnits', 'userSpaceOnUse')
			.append('line')
			.attr('x1', 0)
			.attr('y1', 3)
			.attr('x2', 6)
			.attr('y2', 3)
			.attr('stroke', 'rgba(0,0,0,0.09)')
			.attr('stroke-width', 1);

		// Vertical lines
		defs
			.append('pattern')
			.attr('id', 'pat-vert')
			.attr('width', 6)
			.attr('height', 6)
			.attr('patternUnits', 'userSpaceOnUse')
			.append('line')
			.attr('x1', 3)
			.attr('y1', 0)
			.attr('x2', 3)
			.attr('y2', 6)
			.attr('stroke', 'rgba(0,0,0,0.09)')
			.attr('stroke-width', 1);

		// Dense dots
		defs
			.append('pattern')
			.attr('id', 'pat-dense')
			.attr('width', 5)
			.attr('height', 5)
			.attr('patternUnits', 'userSpaceOnUse')
			.append('circle')
			.attr('cx', 2.5)
			.attr('cy', 2.5)
			.attr('r', 1)
			.attr('fill', 'rgba(0,0,0,0.12)');

		const patterns = [
			'url(#pat-diag)',
			'url(#pat-dots)',
			'url(#pat-cross)',
			'url(#pat-horiz)',
			'url(#pat-vert)',
			'url(#pat-dense)'
		];

		const cell = svg
			.selectAll('g')
			.data(leaves)
			.enter()
			.append('g')
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		// Base gray fill
		cell
			.append('rect')
			.attr('width', (d) => d.x1 - d.x0)
			.attr('height', (d) => d.y1 - d.y0)
			.attr('fill', (_, i) => grays[i])
			.attr('rx', 4);

		// Texture overlay
		cell
			.append('rect')
			.attr('width', (d) => d.x1 - d.x0)
			.attr('height', (d) => d.y1 - d.y0)
			.attr('fill', (_, i) => patterns[i])
			.attr('rx', 4);

		// Category name
		cell
			.append('text')
			.attr('x', 14)
			.attr('y', 30)
			.attr('fill', '#000')
			.attr('font-size', (d) => {
				const w = d.x1 - d.x0;
				if (w < 80) return '0px';
				if (w < 150) return '13px';
				return '18px';
			})
			.attr('font-family', 'Libre Franklin, sans-serif')
			.attr('font-weight', '700')
			.text((d) => (d.data as Resource).category);

		// Count
		cell
			.append('text')
			.attr('x', 14)
			.attr('y', 54)
			.attr('fill', 'rgba(0,0,0,0.6)')
			.attr('font-size', (d) => {
				const w = d.x1 - d.x0;
				if (w < 80) return '0px';
				if (w < 150) return '12px';
				return '16px';
			})
			.attr('font-family', 'Libre Franklin, sans-serif')
			.attr('font-weight', '300')
			.text((d) => d3.format(',')((d.data as Resource).count));
	});
</script>

<div class="not-prose flex justify-center" bind:this={container}></div>
