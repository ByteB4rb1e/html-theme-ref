# Architecture Overview

This project adheres to [IETF RFC2119](https://www.rfc-editor.org/rfc/rfc2119)
for identifying requirement levels.

## Repository Structure

This section provides an overview of the repository's structure, detailing the
purpose of each top-level file and directory. The goal is to help collaborators
and contributors navigate the codebase effectively.

### **ARCHITECTURE.md**

This document, describing the layout and purpose of the project structure.

### **autom4te.cache/**

Automatically generated cache directory used during `autotools` builds.

Typically includes temporary files that assist with the configuration process.

### **build/**

Directory for build artifacts and outputs. Contains compiled or generated files
from the build process.

Should be excluded from version control (see `.gitignore`).

### **config.log, config.status**

Logs and metadata files generated during the execution of `configure`.

Provides debugging details about the system configuration process.

### **configure, configure.ac**

Scripts and files for initializing the project's configuration using
`autotools`.

`configure.ac` defines macros and instructions for generating the `configure`
script.

### **CONTRIBUTING.md**

Guidelines for contributing to the project, including best practices, coding
standards, and submission processes.

### **docs/**

Contains documentation files and resources related to the project, as well as
the source files for usability tests.

### **jest.config.js**

Configuration file for the Jest testing framework. Specifies settings for
running tests in the project.

### **LICENSE**

The license file for the project, describing the terms under which the code can
be used and distributed. It is currently licensed under Creative Commons BY 4.0.

### **Makefile**

Defines targets and rules for the build system.

Provides a common interface (to i.e. CI/CD service) for common tasks like
building, cleaning, or testing.

### **node_modules/**

Directory for installed Node.js dependencies. Managed by `npm` and should not be
manually modified.

### **package.json, package-lock.json**

`package.json`: Defines project metadata, dependencies, and scripts.

`package-lock.json`: Ensures consistent dependency resolution across
environments.

### **postcss.config.ts**

Configuration file for PostCSS, a tool for transforming CSS with plugins. Used
for preprocessing and optimizing CSS stylesheets.

### **README.md**

The primary introductory document for the repository. Provides an overview,
setup instructions, and usage examples.

### **scripts/**

Contains utility scripts for managing or automating tasks within the project.

### **src/**

Source code directory for the project's implementation. Includes the main
logic, components, and modules, which are seperated into `style` and `script`.

### **tests/**

Contains unit and integration tests for the project's scripting. Ensures the
correctness and reliability of the implementation.

### **tsconfig.debug.json, tsconfig.json, tsconfig.node.json**

TypeScript configuration files for different environments or purposes:

* `tsconfig.json`: The base configuration for the project.
* `tsconfig.debug.json`: Additional settings for debugging.
* `tsconfig.node.json`: Configurations specific to Node.js environments, mainly
  for project scripts under `scripts/` executed with `ts-node`.

### **typedoc.json**

Configuration file for TypeDoc, a documentation generator for TypeScript
projects.  Specifies how TypeScript source files should be converted to
documentation.

### **vendor/**

Directory for third-party libraries or dependencies not installed via package
managers. Used for static assets or vendored code. Crucial to let other people
quickly identify third-party assets and their licensing implications.

### **webpack.config.*.js**

Webpack configuration files for bundling the project's assets.

* `webpack.config.debug.js`: Configuration for debugging builds.
* `webpack.config.doc.js`: Configuration for generating documentation builds.
* `webpack.config.js`: The main configuration for production builds.

### **.vimrc**

Configuration file for `vim` text editor. This is to illustrate on what type of
workflow this project is optimized for. Whenever the personal working directory
is set to the root of the repository, or a descendant directory, this
configuration is automatically loaded by `vim`.

## Styling

This project adopts the [SMACSS (Scalable and Modular Architecture for
CSS)](https://smacss.com/) methodology, adhering strictly to the [7:1 SCSS
pattern](https://sass-guidelin.es/#the-7-1-pattern). It focuses on modular,
maintainable, and scalable styles while leveraging scoping and nesting to
simplify naming conventions.

### 0. src/style/main.scss

The `main.scss` file is the entry point that imports all the partials in a
structured order to compile the final CSS. It's the *1* in *7:1*.

**Example:** `main.scss`

```scss
@charset 'utf-8';
@forward 'abstracts/mixins/font';
@forward 'abstracts/variables/colors';
@forward 'abstracts/variables/layout';
@forward 'abstracts/variables/spacings';
@forward 'abstracts/variables/typography';
@forward 'base/typography';
@forward 'base/animations';
@forward 'components/global-options';
@forward 'layout/top-header';
@forward 'layout/top-footer';
@forward 'layout/top-sidebar';
```

### 1. src/style/base/

This directory contains foundational styles for the project, grouped by HTML
elements and semantic purposes. The organization adheres to the principle of
avoiding unnecessary abstraction, making the structure self-explanatory and easy
to maintain. Applying SMACSS conventions SHOULD follow the semantic grouping
defined in the HTML5 specification.

1. **Plain Element Grouping**:
   - Styles are grouped by element to ensure clarity and reduce abstraction.

2. **Semantic Alignment**:
   - Semantic stylesheets mirror HTML5 semantic groupings for intuitive
     organization.
   - This alignment with SMACSS principles ensures logical and scalable
     structuring.

3. **Maintainability**:
   - Files are modular and scalable. Additional rules for an element or semantic
     group can easily be added to the corresponding file without affecting
     unrelated styles.

**Example:** `_base.scss`

```scss
.is-disabled {
    pointer-events: none;
    opacity: 0.5;
}

.is-active {
    visibility: visible;
    opacity: 1;
}

.is-rotten {
    pointer-events: none;
    opacity: 0.6;
}
```

#### Semantic Stylesheets:

For logical grouping based on HTML5 specifications:

* **`_sections.scss`**: For semantic section elements such as `article`, `nav`,
                        `aside`, `header`, etc.
* **`_grouping-content.scss`**: Handles grouping content (`<p>`, `<div>`,
                                `<ul>`, etc.).
* **`_links.scss`**: Specific to links (`<a>`).
* **`_edits.scss`**: Includes styling for edit elements like `mark`, `del`, and
                     `ins`.
* **`_embedded.scss`**: Styles for embedded content (`<img>`, `<video>`, etc.).
* **`_tabular.scss`**: Styles specific to tabular data (`<table>`, `<thead>`,
                       `<td>`, etc.).
* **`_text-level-semantics.scss`**: Styles specific to text-level stuff
                                    (`<small>`, `<kbd>`, etc.).
* **`_forms.scss`**: Form-related elements such as `input`, `button`,
                     `textarea`.
* **`_interactive.scss`**: Interactive elements like `details` and `summary`.
* **`_scripting.scss`**: For scripting-related elements like `<template>` and
                         `<canvas>`.

> NOTE: Not all stylesheets will probably be defined at this time. This is more
  to give an orientation of where what should go.

### 2. src/style/components/

The `components/` directory contains styles for reusable UI components. Each
file focuses on the content and functionality of a specific component in
isolation.

Contextual overrides (like `.is-rotten` for tomato and coconut) are managed at the
component level.

**Example**: `_header.scss`

```scss
.header {
    .nav {
        display: flex;
        gap: 1rem;
    }

    .brand {
        font-size: 1.5rem;
        color: #333;
    }

    .tomato {
        &.is-rotten {
            border: 2px dashed red;
            background-color: brown;
        }
    }

    .coconut {
        &.is-rotten {
            background-image: url('cracked-shell.jpg');
            background-size: cover;
        }
    }
}
```

### 3. src/style/layout/

The `layout/` directory holds stylesheets that define high-level structural
styles for the major parts of the interface, such as headers, sidebars, and
footers. These styles are concerned with positioning and alignment in the
broader layout context.

**Example**: `_header.scss`

```scss
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    background-color: #f8f8f8;
}
```

### 4. src/style/pages/

The `pages/` directory contains stylesheets specific to unique page templates.
These styles SHOULD NOT be reused across other pages.

**Example:** `_about.scss`

```scss
.about-page {
    .section {
        padding: 2rem;
    }
}
```

### 5. src/style/themes/

The `themes/` directory contains stylesheets for theme variations such as light mode or
dark mode. Theme files should apply visual changes without altering the layout
or structure.

**Example:** `_dark.scss`

```scss
.dark-mode {
    --bg-color: #333;
    --text-color: #fff;

    .header {
        background-color: var(--bg-color);
        color: var(--text-color);
    }
}
```

### 6. src/style/abstracts/

The `abstracts/` directory contains stylesheets defining Sass tools that do not
output CSS directly. This includes mixins, functions, and variables.

**Example:** `_utilities.scss`

```scss
@mixin margin-auto {
    margin: auto;
}

@mixin text-center {
    text-align: center;
}
```

### 7. src/style/vendors/

The `vendors/` directory contains stylesheets implementing third-party libraries
or CSS frameworks such as Normalize or external dependencies.

**Example:** `_animate.scss`

```scss
@use "../../../vendor/animate.scss/properties" as *;
@use "../../../vendor/animate.scss/_attention-seekers/attention-seekers" as *;
@forward "../../../vendor/animate.scss/_bouncing-entrances/bouncing-entrances";
@forward "../../../vendor/animate.scss/_bouncing-exits/bouncing-exits";
@forward "../../../vendor/animate.scss/_fading-entrances/fading-entrances";
@forward "../../../vendor/animate.scss/_fading-exits/fading-exits";
@forward "../../../vendor/animate.scss/_flippers/flippers";
@forward "../../../vendor/animate.scss/_lightspeed/lightspeed";
@forward "../../../vendor/animate.scss/_rotating-entrances/rotating-entrances";
@forward "../../../vendor/animate.scss/_rotating-exits/rotating-exits";
@forward "../../../vendor/animate.scss/_sliding-entrances/sliding-entrances";
@forward "../../../vendor/animate.scss/_sliding-exits/sliding-exits";
@forward "../../../vendor/animate.scss/_specials/specials";
@forward "../../../vendor/animate.scss/_zooming-entrances/zooming-entrances";
@forward "../../../vendor/animate.scss/_zooming-exits/zooming-exits";
```

## Notes

Files and directories listed in `.gitignore` are intentionally excluded from
version control to avoid cluttering the repository with unnecessary or generated
files. Lines starting with `/` indicate that only files at the root of the
repository should be excluded. Lines ending with `/` indicate that a directory
is to be excluded.
