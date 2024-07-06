export function $<T extends HTMLElement = HTMLElement>(selector: string, parent?: HTMLElement): T | null {
    return (parent || document).querySelector<T>(selector);
}

export function $$<T extends HTMLElement = HTMLElement>(selector: string, parent?: HTMLElement): T[] {
    return Array.from((parent || document).querySelectorAll<T>(selector));
}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
