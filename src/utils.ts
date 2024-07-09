export function $<T extends HTMLElement = HTMLElement>(selector: string, parent?: HTMLElement): T | null {
    return (parent || document).querySelector<T>(selector);
}

export function $$<T extends HTMLElement = HTMLElement>(selector: string, parent?: HTMLElement): T[] {
    return Array.from((parent || document).querySelectorAll<T>(selector));
}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function intersecting(
    elements: HTMLElement[],
    intersectChange: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void,
    options?: IntersectionObserverInit
) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => intersectChange(entry, observer));
    }, options);

    elements.forEach((element) => observer.observe(element));
}
