# Architecture Overview

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

This folder contains foundational styles and globally shared behaviors that
apply across all components.

Purpose: Define shared behaviors and base styles to maintain consistency
throughout the project.

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

### 2. src/style/components/

The `components/` directory contains styles for reusable UI components. Each
file focuses on the content and functionality of a specific component in
isolation.

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
These styles should not be reused across other pages.

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
