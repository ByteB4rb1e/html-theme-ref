import { Theme } from './main';

/**
 * Extends the global `Window` interface to include custom properties
 * for exposing objects to the developer console.
 *
 * The philosophy behind this is to provide users with full transparency
 * and accessibility to the underlying implementation. The browser, being
 * a tool for the user, should allow access to these objects. This follows
 * the principle that the website does not "own" the browser but rather
 * operates within it. 
 *
 * Security and encapsulation are implemented in the code itself,
 * ensuring sensitive logic is properly safeguarded without relying
 * on hiding objects from the global scope. This approach empowers users
 * to explore and interact with the system while maintaining robust
 * security practices.
 *
 * @property theme - An instance of the `Theme` class, exposed globally
 * for developer console access.
 */
declare global {
    interface Window {
        theme: Theme;
    }
}
