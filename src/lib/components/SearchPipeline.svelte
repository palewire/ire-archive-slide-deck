<script lang="ts">
	import { Search, Brain, Type, Merge, CheckCheck } from 'lucide-svelte';

	const bw = 180;
	const bh = 64;
	const branchH = 70;
	const midY = 170;

	const qX = 65;
	const branchX = 259;
	const combineX = 530;
	const rerankX = 730;

	const w = rerankX + bw + 30;
	const h = midY * 2 + 20;

	const box = '#e5e5e5';
	const line = '#ccc';
</script>

<div class="not-prose flex justify-center">
	<svg
		viewBox="0 0 {w} {h}"
		width={w}
		height={h}
		style="font-family: 'Libre Franklin', sans-serif;"
	>
		<defs>
			<marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
				<polygon points="0 0, 8 3, 0 6" fill="#bbb" />
			</marker>
		</defs>

		<!-- ═══ PATHS ═══ -->
		<line x1={qX + bw} y1={midY} x2={branchX} y2={midY} stroke={line} stroke-width="2" />

		<path
			d="M{branchX},{midY} C{branchX + 30},{midY} {branchX + 30},{midY - branchH} {branchX +
				50},{midY - branchH}"
			fill="none"
			stroke={line}
			stroke-width="2"
		/>
		<line
			x1={branchX + 50}
			y1={midY - branchH}
			x2={branchX + 50 + bw}
			y2={midY - branchH}
			stroke={line}
			stroke-width="2"
		/>
		<path
			d="M{branchX + 50 + bw},{midY - branchH} C{combineX - 20},{midY - branchH} {combineX -
				20},{midY} {combineX},{midY}"
			fill="none"
			stroke={line}
			stroke-width="2"
		/>

		<path
			d="M{branchX},{midY} C{branchX + 30},{midY} {branchX + 30},{midY + branchH} {branchX +
				50},{midY + branchH}"
			fill="none"
			stroke={line}
			stroke-width="2"
		/>
		<line
			x1={branchX + 50}
			y1={midY + branchH}
			x2={branchX + 50 + bw}
			y2={midY + branchH}
			stroke={line}
			stroke-width="2"
		/>
		<path
			d="M{branchX + 50 + bw},{midY + branchH} C{combineX - 20},{midY + branchH} {combineX -
				20},{midY} {combineX},{midY}"
			fill="none"
			stroke={line}
			stroke-width="2"
		/>

		<line x1={combineX + bw} y1={midY} x2={rerankX} y2={midY} stroke={line} stroke-width="2" />
		<line
			x1={rerankX + bw}
			y1={midY}
			x2={w}
			y2={midY}
			stroke={line}
			stroke-width="2"
			marker-end="url(#ah)"
		/>

		<!-- ═══ ANIMATED DOTS (6s cycle, synced) ═══ -->

		<!-- Query → fork: moves 0-1s, holds at end 1-6s -->
		<circle r="4" fill="#999" opacity="0" visibility="hidden">
			<animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.01;0.167;1" calcMode="linear"><mpath href="#pQF" /></animateMotion>
			<animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;0;0.6;0.6;0;0" keyTimes="0;0.005;0.01;0.16;0.17;1" />
			<animate attributeName="visibility" dur="6s" repeatCount="indefinite" values="visible;visible;hidden" keyTimes="0;0.17;1" calcMode="discrete" />
		</circle>
		<path id="pQF" d="M{qX + bw},{midY} L{branchX},{midY}" fill="none" stroke="none" />

		<!-- Top branch: moves 1-4s, holds 0-1s and 4-6s -->
		<circle r="4" fill="#999" opacity="0" visibility="hidden">
			<animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.167;0.667;1" calcMode="linear"><mpath href="#pTop" /></animateMotion>
			<animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;0.6;0.6;0;0" keyTimes="0;0.167;0.66;0.667;1" />
			<animate attributeName="visibility" dur="6s" repeatCount="indefinite" values="hidden;visible;hidden" keyTimes="0;0.167;0.667" calcMode="discrete" />
		</circle>
		<path id="pTop" d="M{branchX},{midY} C{branchX + 30},{midY} {branchX + 30},{midY - branchH} {branchX + 50},{midY - branchH} L{branchX + 50 + bw},{midY - branchH} C{combineX - 20},{midY - branchH} {combineX - 20},{midY} {combineX},{midY}" fill="none" stroke="none" />

		<!-- Bottom branch: moves 1-4s, holds 0-1s and 4-6s -->
		<circle r="4" fill="#999" opacity="0" visibility="hidden">
			<animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.167;0.667;1" calcMode="linear"><mpath href="#pBot" /></animateMotion>
			<animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;0.6;0.6;0;0" keyTimes="0;0.167;0.66;0.667;1" />
			<animate attributeName="visibility" dur="6s" repeatCount="indefinite" values="hidden;visible;hidden" keyTimes="0;0.167;0.667" calcMode="discrete" />
		</circle>
		<path id="pBot" d="M{branchX},{midY} C{branchX + 30},{midY} {branchX + 30},{midY + branchH} {branchX + 50},{midY + branchH} L{branchX + 50 + bw},{midY + branchH} C{combineX - 20},{midY + branchH} {combineX - 20},{midY} {combineX},{midY}" fill="none" stroke="none" />

		<!-- Combine → Rerank: moves 4-5s, holds 0-4s and 5-6s -->
		<circle r="4" fill="#999" opacity="0" visibility="hidden">
			<animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.667;0.833;1" calcMode="linear"><mpath href="#pEnd" /></animateMotion>
			<animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;0;0.6;0.6;0;0" keyTimes="0;0.666;0.667;0.83;0.833;1" />
			<animate attributeName="visibility" dur="6s" repeatCount="indefinite" values="hidden;visible;hidden" keyTimes="0;0.667;0.833" calcMode="discrete" />
		</circle>
		<path id="pEnd" d="M{combineX + bw},{midY} L{rerankX},{midY}" fill="none" stroke="none" />

		<!-- ═══ NODES ═══ -->

		<!-- 1. Search -->
		<rect x={qX} y={midY - bh / 2} width={bw} height={bh} rx="6" fill={box} />
		<foreignObject x={qX} y={midY - bh / 2} width={bw} height={bh}>
			<div class="card">
				<div class="icon"><Search size={22} strokeWidth={1.5} color="rgba(0,0,0,0.35)" /></div>
				<div class="text">
					<div class="title">Search</div>
					<div class="desc">User submits terms</div>
					<div class="tech">SvelteKit → FastAPI</div>
				</div>
			</div>
		</foreignObject>

		<!-- 2a. Meaning Search -->
		<rect x={branchX + 50} y={midY - branchH - bh / 2} width={bw} height={bh} rx="6" fill={box} />
		<foreignObject x={branchX + 50} y={midY - branchH - bh / 2} width={bw} height={bh}>
			<div class="card">
				<div class="icon"><Brain size={22} strokeWidth={1.5} color="rgba(0,0,0,0.35)" /></div>
				<div class="text">
					<div class="title">Meaning Query</div>
					<div class="desc">Understands concepts</div>
					<div class="tech">sentence-transformers</div>
				</div>
			</div>
		</foreignObject>

		<!-- 2b. Keyword Search -->
		<rect x={branchX + 50} y={midY + branchH - bh / 2} width={bw} height={bh} rx="6" fill={box} />
		<foreignObject x={branchX + 50} y={midY + branchH - bh / 2} width={bw} height={bh}>
			<div class="card">
				<div class="icon"><Type size={22} strokeWidth={1.5} color="rgba(0,0,0,0.35)" /></div>
				<div class="text">
					<div class="title">Keyword Query</div>
					<div class="desc">Matches exact words</div>
					<div class="tech">BM25 scoring</div>
				</div>
			</div>
		</foreignObject>

		<!-- 3. Combine -->
		<rect x={combineX} y={midY - bh / 2} width={bw} height={bh} rx="6" fill={box} />
		<foreignObject x={combineX} y={midY - bh / 2} width={bw} height={bh}>
			<div class="card">
				<div class="icon"><Merge size={22} strokeWidth={1.5} color="rgba(0,0,0,0.35)" /></div>
				<div class="text">
					<div class="title">Combine</div>
					<div class="desc">Hybrid of both searches</div>
					<div class="tech">Reciprocal Rank Fusion</div>
				</div>
			</div>
		</foreignObject>

		<!-- 4. Rerank -->
		<rect x={rerankX} y={midY - bh / 2} width={bw} height={bh} rx="6" fill={box} />
		<foreignObject x={rerankX} y={midY - bh / 2} width={bw} height={bh}>
			<div class="card">
				<div class="icon"><CheckCheck size={22} strokeWidth={1.5} color="rgba(0,0,0,0.35)" /></div>
				<div class="text">
					<div class="title">Rerank</div>
					<div class="desc">AI rescores results</div>
					<div class="tech">Cross-encoder model</div>
				</div>
			</div>
		</foreignObject>
	</svg>
</div>

<style>
	.card {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 12px;
		height: 100%;
		box-sizing: border-box;
		font-family: 'Libre Franklin', sans-serif;
	}

	.icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.text {
		min-width: 0;
		text-align: left;
	}

	.title {
		color: #000;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.2;
	}

	.desc {
		color: rgba(0, 0, 0, 0.6);
		font-size: 10px;
		font-weight: 300;
		line-height: 1.4;
	}

	.tech {
		color: rgba(0, 0, 0, 0.35);
		font-size: 9px;
		font-weight: 300;
		line-height: 1.4;
	}
</style>
