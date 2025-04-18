# Contribution Guidelines

This document serves as an outline of development principles. It is named
"Contribution Guidelines" out of convention, not because I'm necessarily hoping
for contributions. Amnesia, Dementia - There are multiple reasons for
documentation being a good idea.

## Development

### Bumping version

The project adheres to semantic versioninig. Bumping the version SHOULD only
apply to file changes under `src/`. Under certain circumstances it may make
sense to bump the version when other files are changed. A commit for bumping the
version MUST come before the commit of changes it is describing.

### Developing a new component

You're developing CSS-first, meaning you don't develop any scripts, if you don't
have a style component it is enhancing. Assuming you know what style component
you want to develop and already created the respective scss source file under
`src/style`, create a new frame under `docs/style/` reflecting it's Sass 7:1
pattern categorization. Then, execute `make uat` in another shell session, which
will start a hot-reload development server hosting the *usability demonstration*
including the frame you just added. Start editing and observe the changes.

> NOTE: You must explicitly open the frame of the index page of the usability
  demonstration for hot-reloading to be applied. Also, there currently is a
  [bug](https://github.com/jantimon/html-webpack-plugin/issues/1768) where
  hot-reloading is not applied to changes made within the `.htm` frames.  You
  need to restart the development server for these changes to be applied.
