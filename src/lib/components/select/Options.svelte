<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import { SELECT_CONTEXT, type Api } from "./Select.svelte";

    const api = getContext<Writable<Api<unknown>>>(SELECT_CONTEXT);
</script>
{#if $api.open}
    <slot/>
{/if}