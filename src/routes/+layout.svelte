<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import Login from '../lib/Login.svelte';
	import { myId } from '../lib/socket';

	const client = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	// const playerId = localStorage.getItem('playerId');
</script>

<svelte:head>
	<title>proximity</title>
</svelte:head>

<QueryClientProvider {client}>
	{#if $myId}
		<slot />
	{:else}
		<Login />
	{/if}
</QueryClientProvider>
