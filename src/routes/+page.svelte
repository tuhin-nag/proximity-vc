<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { gameState, myId, peer } from '../lib/socket';
	import Player from '../lib/Player.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { closeStream, getMicrophone } from '../lib/audio';
	import { onDestroy } from 'svelte';
	import MyPlayer from '../lib/MyPlayer.svelte';

	// console.log(peer);
	$: console.log($gameState);

	const audio = new AudioContext();
	const micPromise = getMicrophone(audio);

	const incomingCalls = new Map<string, MediaStream>();
	peer.on('call', async (call) => {
		const mic = await micPromise;
		call.answer(mic.stream);
		incomingCalls.set(call.peer, call.remoteStream);
	});

	onDestroy(() => {
		audio.close();
		micPromise.then((mic) => closeStream(mic.stream));
	});
</script>

{#await micPromise then mic}
	<main class="bg-neutral-500 overflow-hidden p-2 relative m-2 w-[500px] h-[500px]">
		{#each $gameState.players as player (player.id)}
      {#if player.id === $myId}
        <MyPlayer {player} {audio} />
      {:else}
        <Player {player} mic={mic.stream} {audio} />
      {/if}
		{/each}
	</main>
{/await}
