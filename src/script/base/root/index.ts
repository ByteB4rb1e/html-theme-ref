import { PreferredColorScheme } from './preferred-color-scheme';
import { DiscoMode } from './disco-mode';

/**
 * Facilities for the pseudo `:root` context.
 *
 * Provides an abstraction layer for managing root-level facilities like the
 * preferred color scheme.
 */
export class Root {
    private element: HTMLElement;
    public preferredColorScheme: PreferredColorScheme;
    public discoMode: DiscoMode | null = null;

    /**
     * Initializes facilities in the context of the pseudo `:root` element.
     *
     * @param {HTMLElement} root - The root element (`document.documentElement`) to manage.
     */
    constructor(element: HTMLElement) {
        this.element = element;

        this.preferredColorScheme = new PreferredColorScheme(this.element);

        if (this.element.parentNode === null) {
            console.warn(
                'unable to initialize disco mode, no parentNode on pseudo root element.'
            );
        }

        else {
            this.discoMode = new DiscoMode(
                this.element.parentNode as HTMLElement,
                this.preferredColorScheme
            );
        }

        this.reset();
    }

    public reset() {
        if (this.element) { this.element.style.cssText = "" }

        this.preferredColorScheme = new PreferredColorScheme(this.element);

        this.discoMode = new DiscoMode(
            this.element.parentNode! as HTMLElement, // the parent is not going to magically disappear, like some real parents
            this.preferredColorScheme
        );
    }
}
