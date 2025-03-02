# tiara - modern UNIX-style HTML document theme that scales...

Provide scalable, standardized HTML5 document theming with CSS3 and ECMAScript
2017.

This is my contribution to finding a maturing boilerplate for HTML document
theming. It follows well-known practices for frontend development and adapts
them to DevOps engineering principles. It's the best way I could find to enable
efficient collaboration between IT-professionals with differing specializations,
by applying a strict separation of concern, where plausible.

Very few modifications were applied to the guildelines, philosophies and
principles followed.

The project, in addition to being a skeleton, provides a complete development
environment, documentation with a kitchen-sink, as well as CI/CD interface, so
that one can stream-line all HTML theming related activities into a single
project. This way one can easily (and strictly) integrate a common theme into
content management systems like Wordpress, Typo3, etc., static site generators
like Sphinx, Hugo, etc., as well as micro-blogging services like Blogger.com.
This way one can avoid an escalating commitment towards a system, because
migration to another system is standardized.

## Goals

* adherance to W3 guidelines, UNIX philosophy and KISS principle
* loose-coupling & strict separation of concern
* styling over scripting
* well-structured for command-line driven development
* efficient enough for development on single-screen monitor
* easy integration into content management systems, static site generators, and
  other HTML document systems
* logical grouping through Block-Element-Modifier (BEM) methodology
* Sass-compliant SCSS stylesheets (7-1 pattern)
* modern typed vanilla ECMAScript/JavaScript (Typescript)
* modern up-to date orchestration (latest webpack)
* 3rd party resources baseline (fonts, glyph icons, CSS animations)

## Getting started

### Clone project

git clone https://bitbucket.org/tiaracodes/html-tiara-assets.git

### Initialize build environment

In a POSIX shell session run `sh ./configure` to set up the build environment.

Under PowerShell, execute `git submodule update --init --remote --recursive`,
then `npm install`.

### Reinitialize as your project

Reset `version` and `name` in `package.json`.

Now you have to decide on whether you want to stick with the baseline of
3rd-party resources provided. Currently these are `boxicons` (glyph icons), 
`animate.scss` (css animations), `Mona Sans` (font), and *Inter* (font).

To remove `boxicons` (glyph icons), you need to either supply a replacement font
for glyph icons, or remove all references to *icon* definitions. See
`src/style/vendor/_boxicons.scss`, and `src/style/components/_icon.scss` on
how `boxicons` is interlinked. Once all references are removed, or replaced,
you remove the *dev-dependency* `boxicons` from `package.json`.

To remove `animate.scss` (CSS animations), you need to either supply a
replacement CSS animations, or remove all references to *animations* resources.
See `src/style/vendor/_animate.scss`, and `src/style/base/_animations.scss` on
how `animate.scss` is interlinked. Once all references are removed, or replaced,
you can remove the *animate.scss* git submodule by first deinitializing the
submodule (`git submodule deinit vendor/animate.scss`), then removing it (`git
rm vendor/animate.scss`).

To remove, or replace *Mona sans* (font), or *Inter* (font), you need to either
supply replacement fonts, or remove all references to them. See
`src/style/vendor/_monasans.scss`, `src/style/base/_typography.scss`, and
`src/style/base/_typography.scss` on how fonts are interlinked. Once all
references are removed, or replaced, you can remove the fonts by deleting their
respective directories in `vendor/`.

Make sure to update the templates of the documentation kitchen-sink under
`docs/partial`.

You now have adopted this project. Edit source files under `src/` and use the
`npm` build driver for development. For more information, see
[CONTRIBUTING.md](CONTRIBUTING.md).

### Demoing/Documentation

To start a local web server (with hot-reload) of the documentation and
kitchen-sink, execute `npm run doc`. A new browser window will automatically
open.

### Publishing/Distribution

The project can be distributed as a NPM package (tarball archive). To do so,
execute `npm run dist`, then `npm run mypublish`. The sources can be seamlessly
integrated as subsystem cascade.

### Using CI/CD driver

During the (POSIX) auto-configuration, an installation of GNU Make will have
been checked for. GNU Make is the primary build driver for CI/CD of this project
and is the interface for CI/CD pipelines.
