<script context="module" lang="ts">
	const PIXELATIONS = [0.01, 0.025, 0.05, 0.1, 1.0];
</script>

<script lang="ts">
	import AlbumSearch from '$lib/components/AlbumSearch.svelte';
	import PixelatedImage from '$lib/components/PixelatedImage.svelte';
	import { shuffle } from '$lib/utils';
	import { FastAverageColor } from 'fast-average-color';
	import colors from 'tailwindcss/colors';
	import type { PageData } from './$types';

	export let data: PageData;

	const fac = new FastAverageColor();

	function getQuestions() {
		const albums = shuffle(data.albums);
		return albums.map((album) => ({
			image: album.image.find((im) => im.size === 'extralarge')!['#text'],
			answer: `${album.name} - ${album.artist.name}`
		}));
	}

	let questions = getQuestions();
	let index = 0;
	let guesses = 0;
    let inputRef: AlbumSearch;

	$: question = questions[index];
	console.log(question);

	let guess = '';

	function next() {
		index += 1;
		guess = '';
		guesses = 0;
        setTimeout(() => {
            inputRef.focus();
        }, 200)
	}

	function submit(e: SubmitEvent) {
		console.log(guess, question.answer);
		if (question.answer.toLowerCase() === guess.toLowerCase()) {
            guesses = PIXELATIONS.length - 1;
		}
        else {
            guesses += 1;
        }
	}

	let background: string = colors.red[500];

	async function setBackground(e: CustomEvent<HTMLImageElement>) {
		background = (await fac.getColorAsync(e.detail)).hexa;
		console.log(background);
	}

    function init(el: HTMLElement){
        el.focus()
    }

    $: finished = guesses === PIXELATIONS.length - 1;
</script>

<div class="w-screen h-screen overflow-hidden flex">
	<div class="flex-1 h-full flex justify-center items-center" style:background>
		<PixelatedImage
			class="rounded shadow-md"
			size={PIXELATIONS[guesses]}
			src={question.image}
			width={500}
			height={500}
			on:load={setBackground}
		/>
	</div>
	<div class="flex-1 h-full bg-main flex flex-col justify-center items-center">
        <div class="flex mb-4 gap-2">
            {#each PIXELATIONS.slice(0, -1) as _, i}
                <div class="w-6 h-6 rounded-full"
                    style:background={i < guesses ? background : "#fff"}>
                </div>
            {/each}
        </div>
		<form class="relative" on:submit|preventDefault={submit}>
			<AlbumSearch name="album" disabled={finished} bind:value={guess} bind:this={inputRef}/>
            {#if finished}
                <div class="absolute top-full mt-5 left-0 right-0 text-center">
                    <button class="m-auto font-bold p-2 rounded-md"
                            on:click={next}
                            use:init
                            style:background={background}>
                        Next
                    </button>
                </div>
            {/if}
		</form>
	</div>
</div>
