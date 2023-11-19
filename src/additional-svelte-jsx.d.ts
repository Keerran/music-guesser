declare namespace svelteHTML {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
        "on:change"?: (e: CustomEvent<string>) => void,
        "on:outclick"?: () => void,
    }
}