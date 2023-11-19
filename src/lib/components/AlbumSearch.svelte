<script lang="ts">
	import { Select } from '$lib/components/select';
	import { displayAlbum } from '$lib/utils';

	export let name: string | undefined = undefined;
	export let value = '';
    export let disabled = false;
    export const focus = () => {
        console.log(inputRef);
        inputRef?.focus()
    };

    let inputRef: HTMLInputElement | null;
	let suggestions: any[] = [];

    async function getResults(event: CustomEvent<string>) {
        const query = event.detail;
        if (!query || query.length <= 2) {
            suggestions = [];
            return;
        }
		const res = await fetch(`/api/search?query=${query}`).then((res) => res.json());

		suggestions = res.results;
	}
</script>

<div class="relative">
	<Select displayValue={displayAlbum}>
		<Select.Input class="rounded-md text-xl p-2 w-80" {disabled} on:change={getResults} {name} bind:value bind:inputRef/>
		<Select.Options>
			<div class="absolute">
				{#each suggestions as album (displayAlbum(album))}
					<Select.Option class="bg-white w-full p-2 hover:bg-gray-200 transition-colors duration-150 ease-in-out" value={album} let:selected>
						<span class:font-bold={selected}>
							{displayAlbum(album)}
						</span>
					</Select.Option>
				{/each}
			</div>
		</Select.Options>
	</Select>
</div>
