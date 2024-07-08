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
    selector: string,
    intersectChange: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void,
    options?: IntersectionObserverInit,
    init?: (element: HTMLElement) => void
) {
    $$(selector).forEach(function (target) {
        init?.(target);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => intersectChange(entry, observer));
        }, options);
        observer.observe(target);
    });
}
