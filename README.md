# Tiara's HTML Theming Reference

> Heads, up: I'm still working backwards. The abstract in this README might
  point to non-existing (but also irrelevant) resources. 

> Ditching BEM methodology in favor of SMACSS. BEM doesn't align
  with the principles of this reference implementation, since it doesn't really
  consider scoping to avoid the reuse of components that aren't supposed to be
  reused. There's one thing that I'm afraid of and that is CSS spaghetti...
  Though I can also see some challenges with SMACSS coming up in regards to
  universal state definitions and context-specific styling... Let me make
  analogy: Let's take a tomato and a coconut and we want to describe the
  behavior of them rotting. Tomato visibly rots from the outside, the
  coconut won't. Though it's the same behavior, describing it is different...

This project is a reference implementation designed to explore and discuss ways
to standardize HTML5 theme development using CSS3 and ECMAScript 2017. It’s not
a finished product for public consumption—think of it as a starting point for
developers to dig into, critique, and build upon as we figure out practices to 
standardize together. It combines modern frontend techniques with DevOps
principles to create a scalable, standards-driven theme that generates HTML
assets for static documents or dynamic web applications.

The focus is on:

* **Standardization**: Adhering to W3C standards, UNIX philosophy, and KISS
  principles to create a universal foundation.
* **Collaboration**: Providing a practical example to discuss how HTML theming
  can be consistent across platforms and teams.
* **Separation of Concerns**: Keeping things modular and maintainable to support
  stable automation workflows.

This reference implementation is a solid starting point for developers working
on HTML theme development. It plays nice with all sorts of systems — think CMS
platforms (WordPress, Typo3), static site generators (Sphinx, Hugo), or even
micro-blogging setups (Blogger.com) — showing how standardized themes can cut
down on vendor lock-in and make migrations less of a nightmare. The guidelines
of the various build subsystems are prioritized over any other practices, UNIX
philosophy is just the glue to stick it together. Sticky, but not to sticky, so
that build subsystems also don't cause vendor lock-in.

**Heads-Up**: This is a foundation, not a framework, product, or service. It’s
here for developers to mess with, build on, and kick around ideas — not a
polished, plug-and-play solution. If you’re expecting bug fixes, or feature
requests, you’re in the wrong place. Think of it as a launchpad for discussion
and standardization, not something I’m babysitting. This reference
implementation is the basis for my personal HTML theming though, so there
definetly is conviction.

This project is licensed under WTFPL. For more information, see
[LICENSE](LICENSE). I'm focused on advancing a collaborative standardization
effort, rather than getting bogged down by licensing politics. The beauty of
WTFPL is that it aligns perfectly with this project's ethos: unrestricted
freedom for you to build and collaborate upon without imposing unnecessary
constraints. And if someone maintains their own fork or even improves upon it,
that just contributes to the ecosystem around this project.

## Goals

Here’s what this reference is aiming to achieve — let’s discuss how these align
with your standardization ideas:

* **Strict Standards Compliance**: Following W3C guidelines, UNIX philosophy, and KISS to keep it robust and universal.

* **Modularity**: Loose coupling and strict separation of concerns for maintainable, standardized workflows.

* **CSS-First Approach**: Prioritizing CSS over JavaScript to stay lean and standards-focused.

* **CLI-Driven Builds**: Command-line tools for automation and reproducibility—core to standardized processes.

* **Resource Efficiency**: Works in constrained setups, making it a practical baseline.

* **Universal Integration**: Fits into CMS, static site generators, and more to demonstrate standardization across contexts.

* **SMACSS Methodology**: Logical DOM grouping for consistent structure

* **Sass & 7-1 Pattern**: Modular SCSS stylesheets as a potential standard for styling.

* **Type-Safe JS**: Using TypeScript for reliable, consistent scripting.

* **Lean Webpack Setup**: Minimal dependencies for a standardized build process.

* **Baseline Resources**: Includes fonts, icons, and CSS animations as a starting point—should we tweak these?

This is stable but not static—updates will be minimal to keep it consistent as a
reference. What do you think about these goals? Anything you’d add or change?

## Build Environment

The build setup is designed to show how a standardized HTML theme development
process could look. It’s technical, reproducible, and open for discussion:

* **npm**: Drives the build via package.json for consistency across environments.
* **GNU make**: Drives CI/CD for a consistent interface to the build driver
* **Webpack**: Bundles assets with a lean config — better alternatives?
* **TypeScript**: Ensures script consistency — overkill or essential?
* **Sass**: Compiles SCSS with Dart 3 for modular styles.
* **Jest**: Tests JS to maintain quality — TDD for the win?
* **Stylelint**: Enforces style consistency — standard config is enough?
* **PostCSS & NanoCSS**: Optimizes styles post - build—standard-worthy?

Key commands:

* `npm run build`: Produces production assets.
* `npm run watch`: Auto-rebuilds for experimentation.
* `npm run serve-doc`: Previews the kitchen-sink example — great for discussing implementation.
* `npm run lint:style`: Checks style standards.
* `npm run test:script`: Validates JS behavior.
* `npm run dist`: Packages it up — how should we share standardized themes?

This setup is a proposal—let’s refine it together!

## Getting Started

Want to jump in and shape this standardization effort? Here’s how
developers can engage:

* **Clone It**: `git clone https://bitbucket.org/tiaracodes/html-theme-ref.git`
* **Set Up**: Run `sh ./configure` (POSIX) or `git submodule update --init --remote --recursive && npm install` (PowerShell).
* **Experiment**: Run `npm run serve-doc`, tweak `src/` and test ideas.
* **Discuss**: Check out [CONTRIBUTING.md](CONTRIBUTING.md) and share your thoughts in [GitHub Discussions](https://github.com/oxbqkwwxfrqccwtg/html-theme-ref/discussions)!

To preview the example and docs: `npm run serve-doc`. It’s a kitchen-sink demo to
spark ideas — let me know what you think!

## Customizing It

Use it as a foundation:

* Update `package.json` (`name`, `version`).
* Update `LICENSE`
* Point to your repo: `git remote set-url origin <your-url>`.

Swap out resources (fonts, icons) if needed — details in the README.

How would you adapt it?

**Let’s Talk!**

This is all about engaging you and other developers in a discussion. Does this
setup work as a starting point for standardizing HTML theme development? What’s
missing? Too heavy? Too light? Hit me up with your feedback — I’m all ears!
