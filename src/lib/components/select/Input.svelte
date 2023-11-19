<script lang="ts">
	import { sortByDom } from "$lib/utils";
	import { createEventDispatcher, getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import { SELECT_CONTEXT, type Api } from "./Select.svelte";

    const dispatch = createEventDispatcher();
    const api = getContext<Writable<Api<unknown>>>(SELECT_CONTEXT);

    export let value = "";
    export let debounce = 200;
    export let name: string | undefined = undefined;
    export let inputRef: HTMLInputElement | null = null;

    let inputTimeout: NodeJS.Timeout | null = null;
    function input() {
        if(inputTimeout !== null)
            clearTimeout(inputTimeout)
        inputTimeout = setTimeout(() => {
            $api.value = value;
            $api.open = true;
            dispatch("change", value);
        }, debounce);
    }

    function goToOption(which: "next" | "previous" | "first" | "last") {
        const sortedElements = sortByDom($api.options, opt => opt.element);
        let activeIndex = $api.hovered
            ? sortedElements.findIndex(opt => opt.element === $api.hovered?.element)
            : -1;

        console.log(sortedElements)
        console.log(activeIndex, sortedElements.at(activeIndex))
        switch(which) {
            case "next":
                activeIndex += 1
                break;
            case "previous":
                activeIndex -= 1
                break;
            case "first":
                activeIndex = 0
                break;
            case "last":
                activeIndex = -1
                break;
        }
        activeIndex = Math.min(Math.max(activeIndex, 0), sortedElements.length - 1);
        $api.hovered = sortedElements.at(activeIndex);
    }

    function keyDown(e: KeyboardEvent) {
        switch(e.key) {
            case "ArrowUp":
                e.preventDefault();
                e.stopPropagation();
                if($api.open) {
                    goToOption("previous");
                }
                else {
                    $api.open = true;
                    if(!$api.hovered) {
                        goToOption("first")
                    }
                }
                break;
            case "ArrowDown":
                e.preventDefault();
                e.stopPropagation();
                if($api.open) {
                    goToOption("next");
                }
                else {
                    $api.open = true;
                    if(!$api.hovered) {
                        goToOption("first")
                    }
                }
                break;
            case "Enter":
            case "Tab":
                if(!$api.open || !$api.hovered)
                    return;
                e.preventDefault();
                e.stopPropagation();
                $api.selected = $api.hovered.value
                $api.open = false;
                break;
        }
    }
    
    let selected = $api.selected;
    $: if(selected != $api.selected) {
        selected = $api.selected
        value = $api.value;
        $api.hovered = undefined
        dispatch("change", value);
    };
</script>
<input
    type="text"
    {name}
    bind:value
    bind:this={inputRef}
    on:input={input}
    on:keydown={keyDown}
    autocomplete="off"
    {...$$restProps}
/>