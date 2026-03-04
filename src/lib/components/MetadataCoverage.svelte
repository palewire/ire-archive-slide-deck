<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	interface Field {
		field: string;
		filled: number;
		missing: number;
	}

	const data: Field[] = [
		{ field: 'Title', filled: 33449, missing: 0 },
		{ field: 'Category', filled: 33449, missing: 0 },
		{ field: 'Description', filled: 33377, missing: 72 },
		{ field: 'Resource ID', filled: 33331, missing: 118 },
		{ field: 'Authors', filled: 31381, missing: 2068 },
		{ field: 'Year Created', filled: 24431, missing: 9018 },
		{ field: 'Attachments', filled: 24253, missing: 9196 },
		{ field: 'Conference Name', filled: 7098, missing: 26351 },
		{ field: 'Conference Year', filled: 6582, missing: 26867 },
		{ field: 'Affiliations', filled: 6580, missing: 26869 }
	];

	const total = 33449;

	let container: HTMLDivElement;
	let isMobile = false;

	onMount(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(max-width: 640px)');
		const pct = d3.format('.1%');

		const render = () => {
			isMobile = mq.matches;
			d3.select(container).selectAll('*').remove();

			const width = isMobile ? 420 : 880;
			const margin = isMobile
				? { top: 14, bottom: 14, left: 14, right: 14 }
				: { top: 10, bottom: 10, left: 185, right: 65 };
			const rowHeight = isMobile ? 52 : 32;
			const barHeight = isMobile ? 22 : 22;
			const height = margin.top + margin.bottom + rowHeight * data.length;
			const chartWidth = width - margin.left - margin.right;

			const x = d3.scaleLinear().domain([0, total]).range([0, chartWidth]);

			const svg = d3
				.select(container)
				.append('svg')
				.attr('viewBox', `0 0 ${width} ${height}`)
				.attr('width', '100%')
				.style('max-width', `${width}px`);

			const defs = svg.append('defs');

			// Diagonal lines pattern (from ResourceChart)
			defs
				.append('pattern')
				.attr('id', 'mc-pat-diag')
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

			const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

			const rows = chart
				.selectAll('g.row')
				.data(data)
				.enter()
				.append('g')
				.attr('class', 'row')
				.attr('transform', (_, i) => `translate(0,${i * rowHeight})`);

			const barY = (rowHeight - barHeight) / 2;

			// Missing portion (right side only — avoids overlap artifact at 100%)
			rows
				.append('rect')
				.attr('x', ({ filled }) => x(filled))
				.attr('y', barY)
				.attr('width', ({ filled }) => chartWidth - x(filled))
				.attr('height', barHeight)
				.attr('fill', '#e5e5e5');

			// Filled portion (base gray)
			rows
				.append('rect')
				.attr('x', 0)
				.attr('y', barY)
				.attr('width', ({ filled }) => x(filled))
				.attr('height', barHeight)
				.attr('fill', '#aaa');

			// Filled portion (pattern overlay)
			rows
				.append('rect')
				.attr('x', 0)
				.attr('y', barY)
				.attr('width', ({ filled }) => x(filled))
				.attr('height', barHeight)
				.attr('fill', 'url(#mc-pat-diag)');

			// Field name
			rows
				.append('text')
				.attr('x', isMobile ? 0 : -10)
				.attr('y', isMobile ? barY - 6 : barY + barHeight / 2)
				.attr('dy', isMobile ? '0' : '0.35em')
				.attr('text-anchor', isMobile ? 'start' : 'end')
				.attr('fill', '#000')
				.attr('font-size', isMobile ? '11px' : '12px')
				.attr('font-family', 'Libre Franklin, sans-serif')
				.attr('font-weight', '700')
				.text(({ field }) => field);

			// Percentage
			rows
				.append('text')
				.attr('x', 8)
				.attr('y', barY + barHeight / 2)
				.attr('dy', '0.35em')
				.attr('text-anchor', 'start')
				.attr('fill', '#000')
				.attr('font-size', isMobile ? '10px' : '12px')
				.attr('font-family', 'Libre Franklin, sans-serif')
				.attr('font-weight', '400')
				.text(({ filled }) => pct(filled / total));
		};

		render();
		mq.addEventListener('change', render);
		return () => mq.removeEventListener('change', render);
	});
</script>

<div class="not-prose flex justify-center" bind:this={container}></div>
