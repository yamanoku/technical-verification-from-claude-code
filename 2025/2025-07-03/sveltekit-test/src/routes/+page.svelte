<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let scopeId = '';
	let generatedAt = '';
	let multipleIds = [];
	let clientGeneratedId = '';
	let scopeFunction = null;
	
	// This will likely cause hydration errors
	onMount(async () => {
		try {
			const { scope } = await import('@simple-stack/scope');
			scopeFunction = scope;
			
			// Generate IDs on client mount
			scopeId = scope();
			generatedAt = new Date().toISOString();
			multipleIds = Array.from({ length: 3 }, () => scope());
		} catch (error) {
			console.error('Client-side Simple Scope error:', error);
			scopeId = 'CLIENT_ERROR';
			generatedAt = 'CLIENT_ERROR';
			multipleIds = ['CLIENT_ERROR'];
		}
	});
	
	const regenerateId = () => {
		if (scopeFunction) {
			clientGeneratedId = scopeFunction();
		}
	};
</script>

<svelte:head>
	<title>Simple Scope + SvelteKit SSR Test</title>
</svelte:head>

<div>
	<h1>Simple Scope + SvelteKit SSR Test</h1>
	
	<div class="test-section">
		<h2>Basic Scope Test</h2>
		<p>Scope ID: <code>{scopeId}</code></p>
		<p>Generated at: {generatedAt}</p>
	</div>

	<div class="test-section">
		<h2>Multiple Scopes Test</h2>
		{#each multipleIds as id, index}
			<p>Scope {index + 1}: <code>{id}</code></p>
		{/each}
	</div>

	<div class="test-section">
		<h2>Client-side Re-generation Test</h2>
		<button on:click={regenerateId}>Regenerate ID</button>
		<p>New ID: <code>{clientGeneratedId}</code></p>
	</div>

	<div class="test-section">
		<h2>Hydration Mismatch Detection</h2>
		<p class="warning">
			If you see hydration warnings in the console, Simple Scope is causing SSR/CSR mismatches.
		</p>
		<p>Browser environment: {browser ? 'Yes' : 'No'}</p>
		<p>Server-side rendered: {browser ? 'No' : 'Yes'}</p>
	</div>
</div>

<style>
	.test-section {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.warning {
		color: #d73527;
		font-weight: bold;
	}

	code {
		background: #f4f4f4;
		padding: 2px 4px;
		border-radius: 3px;
		font-family: monospace;
	}

	button {
		background: #007bff;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #0056b3;
	}
</style>