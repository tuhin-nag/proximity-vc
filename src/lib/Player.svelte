<script lang="ts">
	import type { MediaConnection } from 'peerjs';
	import { onDestroy } from 'svelte';
	import { closeStream } from './audio';
	import { getIsInitiator, peer, type Player } from './socket';

	export let player: Player;
	export let mic: MediaStream;
	export let audio: AudioContext;

	const isInitiator = getIsInitiator(player.id);

	let call: MediaConnection | undefined;

	function onCall(c: MediaConnection) {
		if (c.peer !== player.id) return;
		call = c;
		call.answer(mic);
		call.on('stream', setupCall);
	}

	if (isInitiator) {
		console.log('intiating call to', player.id);
		call = peer.call(player.id, mic);
		call.on('stream', setupCall);
	} else {
		console.log(peer.id);
		console.log('waiting for call from', player.id);
		peer.on('call', onCall);
	}

	function setupCall(s: MediaStream) {
		console.log('setting up call');
		stream = s;
		audioElement.srcObject = stream;
		audioElement.play();
		node = audio.createMediaStreamSource(stream);
		// node.connect(audio.destination);
		panner = audio.createPanner();
		node.connect(panner);
		panner.connect(audio.destination);
	}

	let audioElement: HTMLAudioElement;
	let stream: MediaStream | undefined;
	let node: MediaStreamAudioSourceNode | undefined;
	let panner: PannerNode | undefined;

	$: panner?.positionX.setValueAtTime(player.x, audio.currentTime);
	$: panner?.positionZ.setValueAtTime(player.z, audio.currentTime);

	onDestroy(() => {
		call?.close();
		peer.off('call', onCall);
		closeStream(stream);
		node?.disconnect();
		panner?.disconnect();
	});

	const colors = {
		red: '#b22423',
		blue: '#39e6ea'
	} as const;
</script>

<audio bind:this={audioElement} muted />
<div
	style:transform="translate({player.x}px, {player.z}px)"
	style:background={colors[player.team]}
	class="rounded-full w-4 h-4 absolute"
/>
