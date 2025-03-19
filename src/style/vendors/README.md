# Vendors Directory

The `vendors` directory organizes vendor-specific stylesheets and logic, grouped
by the type of asset they define. This naming convention ensures clarity and
consistency across the project.

Each vendor's submodule is given its own subdirectory to encapsulate all related
files. This aligns with the project’s modularity goals and improves scalability.

This convention is designed to easily extend to other types of vendor assets,
such as icons or components, while maintaining a predictable structure.

## Structure

Each vendor submodule MUST follow a consistent structure with (at least) two
files:

* `_variables.scss`: For defining constants and reusable values specific to
  the vendor (e.g., font-family names, color palettes, etc.).
* `_main.scss`: For asset-specific logic, referencing the constants from
  `_variables.scss`.

This slim convention keeps the directory structure predictable and easy to
maintain while supporting modularity and scalability.

### Examples

For a vendor submodule defining a font-face called `Mona Sans`:

`vendors/MonaSans/_variables.scss`:

```scss
// Defines the name of the font-face's family name.
$font-family: 'Mona Sans';
// Specifies the path to the local font files for the `Mona Sans` font.
$local-path: '../../../vendor/Mona\ Sans/monasansvf';
```

`vendors/MonaSans/_main.scss`:

```scss
@use '../abstracts/mixins' as mixins;
@use './variables' as *;

@include mixins.font($font-family, $local-path, 1 999);
```

### Benefits

This structure ensures:
* Vendor styles remain modular and self-contained.
* The project is easily scalable as new asset types are added.
* Maintenance is streamlined by clearly defining the roles of each file.
