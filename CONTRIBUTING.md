# Contribution Guidelines

## Initialization

### Initialize build environment

In a POSIX shell session run `sh ./configure` to set up the build environment.

Under PowerShell, execute `git submodule update --init --remote --recursive`,
then `npm install`.

### Reinitialize as your own reference implementation

Reset `version` and `name` in `package.json`.

Reset the remote of the repository by executing 
`git remote set-url origin <url-to-your-repository>`.

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
Reset `version` and `name` in `package.json`.

Reset the remote of the repository by executing 
`git remote set-url origin <url-to-your-repository>`.

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

## Development

### Linting

#### Stylesheet Linting

To lint all stylesheets, run

```
npm run lint:style
```

To lint a single stylesheet, run

```
npx stylelint src/style/<path-to-stylesheet>
```

## Maintenance

### npm Lockfile

I use a [Verdaccio](https://verdaccio.org/) instance as pull-through mirror to reduce reliance on the
public npm registry and the *npm cache* to minimize external traffic and be able
to back up all packages in a structured way. While the intention behind this
setup was to create a smooth and efficient workflow, it comes with some
significant caveats that make maintenance more complicated than it should be:

When using Verdaccio, the resolved fields in package-lock.json will reference
the local Verdaccio instance (e.g., `http://localhost:xxxx`). While this works
fine locally, it becomes a problem when:

* Sharing the repository with others who don’t have access to your Verdaccio
  instance.
* Running builds or deployments in environments that cannot access localhost.

If you’re working with a local pull-through mirror (which I'd recommend), you
need to reset the resolved fields in the `package-lock.json` to point back to
the public npm registry. 
#### Broken Assumptions about Package Resolution

One would assume the checksums in `package-lock.json` are there to ensure file
integrity—so why does npm care where the file is downloaded from? This setup
enforces fidelity to the original source, adding unnecessary hurdles to
otherwise straightforward workflows. The checksum isn't used as a checksum,
instead it's being used as a salt for a checksum, which is the URL to the
file...

#### Registry Rewrites

If you switch registries between Verdaccio and the public npm registry, you’ll
have to regenerate package-lock.json or rewrite the resolved URLs manually. 

Do so by updating your registry configuration first:

To be safe (it's always surprising what "features" npm maintainers come up
with), delete the lockfile and modules directory (`rm -rf package-lock.json
node_modules`). Then, install the modules again and commit the
changes to the lockfile. 

```
npm install --registry=https://registry.npmjs.org
```

This effectively turns maintaining the lock file into a chore and goes against
the very idea of reproducibility that npm claims to promote.

To ease the pain, there's a `package-lock.json` target for GNU Make. Use `make
package-lock.json`.

#### Verdaccio's Purpose vs Reality

The goal was simple: reduce external traffic, streamline dependencies, and own
our assets without relying on npm’s cache. Instead, we’re stuck with a system
that prioritizes inflexible conventions over practical needs. What should have
been a clean optimization has turned into a maintenance headache.

## Issue tracking

Currently via e-mail, see `package.json` for an address.
