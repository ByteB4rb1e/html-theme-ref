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

## Issue tracking

Currently via e-mail, see `package.json` for an address.
