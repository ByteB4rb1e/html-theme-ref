# Script Directory

The script directory contains ECMAScript 2020 source files, that serve as the
transpilation source for browser-supported Javascript.

## Philosophy

### The 7:1 Pattern Applied to Scripting

The **7:1 pattern** is an organizational structure used for SCSS stylesheets.
Also applying it to scripting makes sense, because it creates a direct
interconnectedness between the styles and scripts, ensuring that every script
defined is tied to a corresponding definition in the SCSS.

By applying this pattern, we align the script organization with the modular
structure of the SCSS. This not only enforces consistency across the codebase
but also limits the scope of scripting to enhance maintainability and clarity.
In practice, this means scripts are not arbitrarily defined—they exist only to
support or interact with the definitions in the SCSS.

Why this matters?

* **Interconnectedness**: The structure ensures that changes to styles and
  scripts are synchronized. For example, a base script supports foundational
  SCSS definitions, while components align to specific SCSS modules.
* **Modular Approach**: Just as SCSS is organized into logical sections (e.g.,
  base, components, utilities), scripting adheres to the same framework for
  clarity and coherence.
* **Maintainability**: Developers can quickly locate and update scripts tied to
  specific SCSS styles, reducing complexity and avoiding duplication.

This interconnected philosophy streamlines both design and development, creating
a unified approach across stylesheets and scripts.

This pattern also ensures that new features can be added seamlessly, as the
structured alignment between SCSS and scripts reduces integration challenges

### Script accessibility

The website operates within the browser, and the browser belongs to the user.
approach focuses on empowering users with full access to the underlying
implementation, while maintaining robust security through proper encapsulation.
Obfuscating the implementation by not exposing to the `window` context is a
questionable practice. Proper encapsulation and implementation layout is what
makes code secure and robust instead, not hiding it.

This approach streamlines the development workflow, enabling rapid testing and
debugging. With direct access to script features via the developer console,
developers can experiment and iterate without the overhead of explicitly linking
scripts to DOM elements for testing.

## Usage

Usage applies to both interactive REPL scripting (through the browser's
development console), as well as direct integration into the DOM.

### Theme (top-level entrypoint)

The `Theme` class acts as the main entry point for applying scripting to style.
It is defined in `src/script/main.ts`.

* Initializing the theme: `window.theme.init()`
* Deinitializing the theme: `window.theme.deinit()`
* Resetting the theme: `window.theme.reset()`

### Root (:root pseudo-element)

The `Root` class represents the pseudo `:root` element of the DOM. It is defined
in `src/script/base/root.ts`, with it's style equivalent being defined under
`src/style/base/_root.scss`.

* Resetting root: `window.theme.root.reset()`

#### PreferredColorScheme (prefered-color-scheme media query)

The `PreferredColorScheme` class serves as a quasi drop-in replacement for
browser's default prefered-color-scheme media query behavior, which is
responsible for applying light/dark color schemes in accordance with the
operating systems color scheme settings. This is necessary for browser's that
may have this functionality disabled for privacy reason (like Mullvad Browser)
as it can be used for fingerprinting browser-sessions.

* toggling the color scheme: `window.theme.root.preferredColorScheme.toggle()`
