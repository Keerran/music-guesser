import type { Action } from "svelte/action";
import type { Album } from "./types";

export function randomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function debounce<T extends (...args: Parameters<T>) => void>(this: ThisParameterType<T>, fn: T, delay = 300) {
    let timer: NodeJS.Timeout | undefined
    return (...args: Parameters<T>) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
    }
}

export const clickOutside: Action<HTMLElement, undefined> = node => {
    const handleClick = (event: MouseEvent) => {
        if (!node.contains(event.target as Node)) {
            node.dispatchEvent(new CustomEvent("outclick"));
        }
    };

    document.addEventListener("click", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        }
    };
}

export function sortByDom<T>(items: T[], getElement: (item: T) => HTMLElement): T[] {
    return items.sort((a, b) => {
        const aEl = getElement(a);
        const bEl = getElement(b);
        const pos = aEl.compareDocumentPosition(bEl);
        if(pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if(pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
    });
}

// Shamelessly stolen from: https://github.com/tailwindlabs/headlessui/blob/main/packages/playground-react/utils/match.ts#L1
export function match<TValue extends string | number = string, TReturnValue = unknown>(
    value: TValue,
    lookup: Record<TValue, TReturnValue | ((...args: unknown[]) => TReturnValue)>,
    ...args: unknown[]
): TReturnValue {
    if (value in lookup) {
        const returnValue = lookup[value]
        return typeof returnValue === 'function' ? returnValue(...args) : returnValue
    }

    const error = new Error(
        `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
            lookup
        )
            .map((key) => `"${key}"`)
            .join(', ')}.`
    )
    if (Error.captureStackTrace) Error.captureStackTrace(error, match)
    throw error
}

export function shuffle<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray;
}

export function displayAlbum(value: Album) {
    return `${value.name} - ${value.artist}`
}