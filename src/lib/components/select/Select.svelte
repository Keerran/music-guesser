<script lang="ts" context="module">
	export const SELECT_CONTEXT = Symbol();

    export interface Option<T> {
        value: T
        element: HTMLElement,
    }

    export interface Api<T> {
		open: boolean;
		selected: T | undefined;
		value: string;
		options: Option<T>[];
		displayValue: (item: T) => string;
		container?: HTMLDivElement;
        hovered?: Option<T>;
	}
</script>

<script lang="ts" generics="T">
	import { clickOutside } from '$lib/utils';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let displayValue = (value: T) => value as string;

	const context = writable<Api<T>>({
		open: false,
		selected: undefined,
		value: '',
		options: [],
		displayValue,
	});

	let ref: HTMLDivElement;

	$: $context.container = ref;

	$: if ($context.selected) {
		$context.value = $context.displayValue($context.selected);
	}

	setContext(SELECT_CONTEXT, context);
</script>

<div
	style:display="contents"
	bind:this={ref}
	use:clickOutside
	on:outclick={() => ($context.open = false)}
>
	<slot />
</div>
