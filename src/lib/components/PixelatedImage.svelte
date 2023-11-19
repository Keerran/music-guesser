<script lang="ts" context="module">
    interface Events {
        load: HTMLImageElement,
    }

    export const ssr = false;
</script>
<script lang="ts">
	
	import { createEventDispatcher, onMount } from "svelte";

    export let src: string;
    export let size: number;
    export let width: number;
    export let height: number;

    let canvas: HTMLCanvasElement;

    const dispatch = createEventDispatcher<Events>();
    let img: HTMLImageElement;
    
    onMount(() => {
        img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            dispatch("load", img)
            pixelate(size);
        };
    }) 

    $: if(img) img.src = src;

    function pixelate(pixelation: number) {
        const w = width * pixelation;
        const h = height * pixelation;
        const ctx = canvas.getContext("2d")!;

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, w, h);
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
    }

    $: if(canvas) pixelate(size);
</script>

<canvas {...$$restProps} bind:this={canvas} {width} {height}/>

<style>
    canvas {
        image-rendering: optimizeSpeed;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -o-crisp-edges;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
    }
</style>