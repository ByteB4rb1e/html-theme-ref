<a name="tiaras-html-theming-reference"></a>
# Tiara's HTML Theming Reference

A HTML theming reference implementation for CSS-first, frameworkless, static,
modular, yet modern and contemporary HTML-theming for traditionalist UNIX & GNU
enthusiasts. It contains a complete workflow for developing and distributing
tested, decoupled, optimized and documented assets for theming HTML documents.
It has minimal build environment requirements and UNIX-principled choices of
matured build subsystems were made.

This *HTML theme* not a standalone component. Even though it provides a
functional usability demonstration, its output is meant to be integrated into
other components, say a [Sphinx](https://www.sphinx-doc.org), or
[Wordpress](https://wordpress.org) theme.

This project serves as a personal reference implementation and demonstration
of HTML document theming principles. It is shared in the spirit of openness,
with no immediate plans for external contributions.

## Usage

### Generate distribution

```
sh ./configure
```

It automatically checks for required programs. If any are missing, the script
halts and provides guidance on how to resolve the issue.

```
make
```

That's all. You will find a tarball distribution under `dist/`, including a
usability demonstration under `package/_docs/`.

To exclude the usability demonstration execute the following:

```
make NO_DOCS=1
```

Refer to `Makefile` for insights into my development principles and workflows.
Documentation is scattered throughout the sources and each directory within this
repository.

### Use distribution

Acquire the distribution, untar everything in the archive listed in
`package/assets.txt`. Note that the paths specified in `package/assets.txt` are
relative to `package/`.

In addition you'll find a usability demonstration under `package/_docs/` within
it.

The distribution has been generated by a modified `npm pack` workflow
(`scripts/pack.ts`) as to not require an executable out of the Node.js/npm
runtime environment. This comes at the cost of having to adhere to the npm
packaging layout, which results in the distribution being nested inside a
`package/` directory.

<a name="licensing"></a>
## Licensing

Sharing is caring! This project is licensed under a Creative Commons Attribution
4.0 International License, as my focus is on monetizing services rather than
products.

You should have received a copy of the license along with this
work. If not, see <https://creativecommons.org/licenses/by/4.0/>.
