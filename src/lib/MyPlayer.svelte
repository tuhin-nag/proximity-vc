<script lang="ts">
	import { onMount } from 'svelte';
	import { sendToPeer, type Player } from './socket';

	export let player: Player;
	export let audio: AudioContext;

	$: audio.listener?.positionX.setValueAtTime(player.x, audio.currentTime);
	$: audio.listener?.positionZ.setValueAtTime(player.z, audio.currentTime);

	// const colors = {
	// 	red: '#b22423',
	// 	blue: '#39e6ea'
	// } as const;

	const pressedKeys = new Set<string>();

	onMount(() => {
		const tick = () => {
			raf = requestAnimationFrame(tick);
			const delta = [0, 0] as [number, number];
			if (pressedKeys.has('w')) delta[0] -= 1;
			if (pressedKeys.has('s')) delta[0] += 1;
			if (pressedKeys.has('a')) delta[1] -= 1;
			if (pressedKeys.has('d')) delta[1] += 1;
			if (delta[0] || delta[1]) {
				sendToPeer({
					delta
				});
			}
		};
		let raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<svelte:window
	on:keydown={(e) => pressedKeys.add(e.key)}
	on:keyup={(e) => pressedKeys.delete(e.key)}
/>

<div
	style:transform="translate({player.x}px, {player.z}px)"
	style:background="yellow"
	class="rounded-full w-8 h-8 absolute"
/>
