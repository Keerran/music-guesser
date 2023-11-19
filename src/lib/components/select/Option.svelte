<script lang="ts" generics="T">
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { SELECT_CONTEXT, type Api } from './Select.svelte';

	const api = getContext<Writable<Api<T>>>(SELECT_CONTEXT);

	export let value: T;
	export let as = 'div';

	let ref: HTMLElement;

	onMount(() => {
        const opt = {
            value,
            element: ref,
        };
		$api.options = [...$api.options, opt];
        return () => 
            $api.options = $api.options.filter(opt => opt.element !== ref);
    })

	function select() {
        $api.selected = value;
        $api.hovered = undefined;
        $api.open = false;
    }
</script>

<svelte:element
	this={as}
	{...$$restProps}
	bind:this={ref}
	on:click={select}
	role="button"
	tabindex="-1"
>
	<slot selected={$api.hovered?.element === ref}/>
</svelte:element>
