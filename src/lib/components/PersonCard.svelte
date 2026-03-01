<script lang="ts">
	let {
		src,
		name,
		email
	}: {
		src: string;
		name: string;
		email: string;
	} = $props();
</script>

<div class="text-center">
	<img {src} alt={name} class="photo" />
	<div class="name">{name}</div>
	<div class="email">{email}</div>
</div>

<style>
	.photo {
		width: 140px;
		height: 140px;
		object-fit: cover;
		margin: 0 auto;
	}

	.name {
		margin-top: 8px;
		font-size: 14px;
		font-weight: 700;
		color: #000;
	}

	.email {
		font-size: 10px;
		font-weight: 300;
		color: rgba(0, 0, 0, 0.5);
	}
</style>
