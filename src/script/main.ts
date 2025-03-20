import * as base from './base';

/**
 * Theme script entry point
 */
export class Theme {
    public root: base.Root | null = null;

    /**
     * Initializes the script by setting up all required components.
     */
    public init(): void {
        if (this.root) {
            console.warn("theme script: already initialized.");
            return;
        }

        this.root = new base.Root(document.documentElement);

        console.info("theme script: initialized successfully.");
    }

    /**
     * Deinitializes the script by tearing down components and resetting the
     * environment.
     */
    public deinit(): void {
        if (!this.root) {
            console.warn(
                "theme script: not initialized. Nothing to deinitialize."
            );
            return;
        }
        try {
             this.root.reset();
             console.info("theme script: root reset successfully.");
        }

        catch (error) {
             console.error("theme script: error during root reset:", error);
        }

        this.root = null;

        console.info("theme script: deinitialized successfully.");
    }

    /**
     * Reinitializes the script by first deinitializing and then initializing.
     */
    public reset(): void {
        console.info("theme script: reinitializing...");
        this.deinit();
        this.init();
    }
}

const theme = new Theme();
export default theme;

// Attach to the global window object for browser access
if (typeof window !== "undefined") {
    window.theme = theme;
}
