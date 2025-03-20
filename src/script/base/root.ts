export enum ColorScheme {
    Light,
    Dark
}

const COLORSCHEME_NAMES: {[name: number]: string} = {
    [ColorScheme.Light]: 'light',
    [ColorScheme.Dark]: 'dark'
};

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
        if (pattern.test(property)) { // Match properties against the regular expression
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
 * Applies the current color scheme by updating CSS variables on the root
 * element.
 * 
 * Ensures the DOM reflects the active light/dark mode.
 */
function applyColorScheme(
    root: Element,
    scheme: ColorScheme,
): void {
    var computedStyles = getComputedStylesByPattern(
        root,
        COLORSCHEME_VARPATTERN
    );

    const targetNamePostfix = `-${COLORSCHEME_NAMES[scheme]}`;

    const sourceNamePostfix = '-' + {
        [ColorScheme.Light]: COLORSCHEME_NAMES[ColorScheme.Dark],
        [ColorScheme.Dark]: COLORSCHEME_NAMES[ColorScheme.Light]
    }[scheme];

    var targets = Object.keys(computedStyles).filter(name => name.endsWith(
        targetNamePostfix
    ));

    for (var name in computedStyles) {
        if (targets.includes(name)) { continue }

        let sourceBaseName =  name.substring(
            name.length - sourceNamePostix.length
        );

        for (var targetName in targets) {
            let targetBaseName =  name.substring(
                name.length - sourceNamePostix.length
            );

            if (sourceBaseName === targetBaseName) {

                console.log(
                    `preferred-color-scheme: ${sourceBaseName} -> ${targetName}`
                );

                root.style.setProperty(
                    targetBaseName,
                    computedStyles[targetName]
                );
            }
        }
    }
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
    private root: Element;

    /**
     * Initializes the PreferredColorScheme class.
     * Sets the initial color scheme based on the user's system preference and
     * applies it to the DOM.
     */
    constructor(root: Element) {
        this.root = root;
        this.currentScheme = getColorSchemeSystemPreference();

        applyColorScheme(this.root, this.currentScheme);
    }

    /**
     * Toggles the current color scheme between light and dark
     * Updates the state and reapplies the scheme to the DOM.
     */
    public toggle(state?: ColorScheme): void {
        this.currentScheme = state ?? (
            this.currentScheme === ColorScheme.Dark
        ) ? ColorScheme.Light : ColorScheme.Dark;

        this.applyColorScheme(this.root, this.currentScheme);
    }
}

/**
 * Facilities for the pseudo `:root` context
 */
export class Root {
    private preferredColorScheme: PreferredColorScheme;

    /**
     * Initializes facilities in the context of the pseudo `:root` element
     */
    constructor(root: Element) {
        this.preferredColorScheme = new PreferredColorScheme(root);
    }

    public togglePreferredColorScheme(scheme?: ColorScheme) {
        var scheme = scheme ?? ColorScheme.Dark;
    }
}
