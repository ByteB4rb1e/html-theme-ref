export enum ColorScheme {
    Light,
    Dark
}

const COLORSCHEME_NAMES: {[name: number]: string} = {
    [ColorScheme.Light]: 'light',
    [ColorScheme.Dark]: 'dark'
};

/**
 * Regular expression pattern for identifying CSS variables related to the color
 * scheme.
 *
 * Requirements for CSS variables:
 * * Variables must follow a naming convention that includes the prefix
 *   `--color-`.
 * * Variables should include a postfix indicating the color scheme (e.g.,
 *   `-light` or `-dark`),
 * * to differentiate between light and dark modes.
 * * Example valid variables: `--color-background-light`, `--color-text-dark`.
 *
 * This pattern ensures that only relevant CSS variables are matched and
 * processed by the script.
 */
const COLORSCHEME_VARPATTERN: RegExp = new RegExp('--color-.*');

/**
 * Retrieve all computed CSS variables matching a regular expression
 *
 * @returns map of matched CSS variable names and their values
 */
function getComputedStylesByPattern(
    element: HTMLElement,
    pattern: RegExp
): Record<string, string> {
    const computedStyles = getComputedStyle(element);
    const cssVariables: Record<string, string> = {};

    for (let i = 0; i < computedStyles.length; i++) {
        const property = computedStyles[i];
        if (pattern.test(property)) {
            const value = computedStyles.getPropertyValue(property).trim();
            cssVariables[property] = value;
        }
    }

    return cssVariables;
}

/**
 * Retrieves the user's system preferred color scheme.
 *
 * @returns {string} The system's preferred color scheme, either 'light' or
 *                   'dark'.
 */
function getColorSchemeSystemPreference(): ColorScheme {
    return window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches ? ColorScheme.Dark : ColorScheme.Light;
}

/**
 * Applies the specified color scheme (light or dark) to the provided root
 * element by dynamically updating CSS variables. This function ensures the DOM
 * reflects the active scheme by mapping source variables to their corresponding
 * target variables.
 *
 * Variables are matched and updated based on postfix patterns, ensuring
 * seamless transitions between light and dark modes.
 *
 * @param {Element} root - The root element (typically `document.documentElement`)
 *                         where the CSS variables are defined and updated.
 * @param {ColorScheme} scheme - The color scheme to apply (either 
 *                               `ColorScheme.Light` or `ColorScheme.Dark`).
 */
function applyColorScheme(
    root: HTMLElement,
    scheme: ColorScheme,
): void {
    var computedStyles = getComputedStylesByPattern(
        root,
        COLORSCHEME_VARPATTERN
    );

    const targetPostfix = `-${COLORSCHEME_NAMES[scheme]}`;
    const sourcePostfix = '-' + {
        [ColorScheme.Light]: COLORSCHEME_NAMES[ColorScheme.Dark],
        [ColorScheme.Dark]: COLORSCHEME_NAMES[ColorScheme.Light]
    }[scheme];

    const sourceMap: Record<string, string> = {};
    const targetMap: Record<string, string> = {};

    Object.keys(computedStyles).forEach((name) => {
        if (!COLORSCHEME_VARPATTERN.test(name)) {
            console.warn(
                `CSS variable "${name}" does not match the expected pattern "${COLORSCHEME_VARPATTERN}".`
            );
        }

        if (name.endsWith(sourcePostfix)) {
            const baseName = name.slice(0, -sourcePostfix.length);
            sourceMap[baseName] = name;
        }

        else if (name.endsWith(targetPostfix)) {
            const baseName = name.slice(0, -targetPostfix.length);
            targetMap[baseName] = name;
        }
    });

    Object.keys(sourceMap).forEach((baseName) => {
        if (targetMap[baseName]) {
            console.log(
                `setting preferred-color-scheme: ${baseName} -> ${targetMap[baseName]}`
            );
            root.style.setProperty(
                baseName,
                computedStyles[targetMap[baseName]]
            );
        }

        else {
            console.warn(
                `CSS variable "${baseName}" has a source (${sourceMap[baseName]}) but no corresponding target.`
            );
            return;
        }
    });
}

/**
 * Manages the preferred color scheme (light/dark) for the application,
 * including detection of system preferences, dynamic toggling, and application
 * of schemes.
 *
 * This class encapsulates both the logic and state required to handle
 * light and dark modes, providing a clean and reusable implementation.
 *
 * Why was this implemented?
 *
 * This feature bridges functionality for browsers like *Mullvad Browser*, which
 * prevent automatic light/dark switching via `prefers-color-scheme` for privacy
 * reasons. By abstracting and tracking the state manually, we ensure consistent
 * behavior across privacy-first environments without relying solely on media
 * queries.
 */
class PreferredColorScheme {
    /**
     * The current color scheme being applied.
     */
    private currentScheme: ColorScheme;

    /**
     * The root pseudo-element
     */
    private root: HTMLElement;

    /**
     * Initializes the PreferredColorScheme class.
     *
     * Sets the initial color scheme based on the user's system preference and
     * applies it to the DOM.
     *
     * @param {HTMLElement} root - The root element where CSS variables are defined and updated.
     */
    constructor(root: HTMLElement) {
        this.root = root;
        this.currentScheme = getColorSchemeSystemPreference();

        applyColorScheme(this.root, this.currentScheme);
    }

    /**
     * Toggles the current color scheme between light and dark.
     *
     * Updates the state and reapplies the scheme to the DOM.
     *
     * @param {ColorScheme} [state] - (Optional) The specific color scheme to toggle to.
     *                                If not provided, toggles to the opposite scheme.
     */
    public toggle(state?: ColorScheme): void {
        if (
            state !== undefined && 
            !Object.values(ColorScheme).includes(state)
        ) {
            console.error(
                `Invalid color scheme: "${state}". Expected "ColorScheme.Light" or "ColorScheme.Dark".`
            );
            return;
        }

        this.currentScheme = state ?? (
            this.currentScheme === ColorScheme.Dark
        ) ? ColorScheme.Light : ColorScheme.Dark;

        applyColorScheme(this.root, this.currentScheme);
    }
}

/**
 * Facilities for the pseudo `:root` context.
 *
 * Provides an abstraction layer for managing root-level facilities like the
 * preferred color scheme.
 */
export class Root {
    private element: HTMLElement;
    public preferredColorScheme: PreferredColorScheme;

    /**
     * Initializes facilities in the context of the pseudo `:root` element.
     *
     * @param {HTMLElement} root - The root element (`document.documentElement`) to manage.
     */
    constructor(element: HTMLElement) {
        this.element = element;
        this.preferredColorScheme = new PreferredColorScheme(element);
        this.reset();
    }

    public reset() {
        if (this.element) { this.element.style.cssText = "" }
        this.preferredColorScheme = new PreferredColorScheme(this.element);
    }
}
