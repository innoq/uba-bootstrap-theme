# UBA Bootstrap 5 Theme

## Usage

This theme is a complete replacement for Bootstrap 5.3. It already includes all of
Bootstrap's styles, so you only need to include `uba-bootstrap-theme.css` — do not
add Bootstrap's own `bootstrap.css` on top of it.

    npm install uba-bootstrap-theme --save

The `dist/css/` directory contains two variants of the same stylesheet:

- **`uba-bootstrap-theme.css`** — unminified, includes source maps; use this during development for readable CSS and accurate browser devtools references.
- **`uba-bootstrap-theme.min.css`** — minified for production; smaller file size, same styles.

If you like to use this theme in your own Sass code and installed this theme
with NPM you can import the source files to your manifest (e.g. `index.scss`)
as well.

```scss
@import "uba-bootstrap-theme/src/styles/index.scss";
```

If you need documentation or help with Bootstrap or its components in general,
please head over to

<https://getbootstrap.com>


## Development

### Setup

* Install Node 24 or higher (see `engines` in `package.json`)
* Clone project `git clone git@github.com:innoq/uba-bootstrap-theme.git`
* Go into the project folder `cd uba-bootstrap-theme`
* Install dependencies `npm install` (Bootstrap is a regular npm dependency — no
  submodule needed)

### Working on the theme

* Build the stylesheets and assets once: `npm run dist`
* Watch & preview the showcase pages while editing: `npm start`
  (recompiles on change and serves `static/showcase.html` and
  `static/components.html`)
* Lint the Sass: `npm test`

### Full Bootstrap documentation with UBA styling

For a living styleguide showing every Bootstrap component in UBA styling, build
the upstream Bootstrap docs and skin them with the theme:

    npm run docs

This clones Bootstrap pinned to the exact version of the `bootstrap` dependency
into `.docs-build/` (gitignored), builds its docs, and writes the UBA-styled site
to `./documentation/`. The clone, its dev dependencies and the generated docs are
never part of the published npm package — theme consumers only ever get `src` and
`dist`. Serve the result with any static server, e.g.:

    python3 -m http.server -d documentation 8080

The generated site has two parts:

- **`/docs/5.3/`** — the full upstream Bootstrap documentation, restyled with the
  theme (every standard component as it looks in UBA styling).
- **`/uba/showcase.html`** and **`/uba/components.html`** — the project's own
  showcase of UBA-specific constructs that are *not* part of Bootstrap: the
  custom `site-header` / navbar variants (with and without service menu, light and
  dark), footer, sitemap and card variants. These are copied from `static/` during
  the build, so editing the showcase there keeps the docs in sync.

The first run is slow (it installs Bootstrap's own docs toolchain inside
`.docs-build/`); subsequent runs reuse the clone.

## Releasing

A release is published to npm by a maintainer bumping the version and
publishing the corresponding GitHub Release. The actual `npm publish` runs in
GitHub Actions (`.github/workflows/release.yml`) and authenticates to npm via
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) — no npm
token is stored anywhere. The build (`npm run dist`) and linting (`npm test`)
run automatically via the `prepublishOnly` hook.

Cutting a release is one command, driven by
[release-it](https://github.com/release-it/release-it) (`.release-it.json`):

```sh
export GITHUB_TOKEN=$(gh auth token)   # release-it talks to the GitHub API
npm run release -- minor               # or major, patch, or an exact version
```

It lints and builds first, then bumps the version, commits it as `Version
X.Y.Z`, tags `vX.Y.Z`, pushes, and creates the GitHub Release. It deliberately
does **not** run `npm publish` itself — publishing the GitHub Release triggers
the workflow, which builds and publishes to npm.

Add `--dry-run` to walk through every step without changing anything. To
release the version already in `package.json` without bumping, use
`npm run release -- --no-increment`.

A push to `master` on its own publishes nothing; only a published GitHub
Release does.

### Manual fallback

If the pipeline is unavailable, an npm owner can publish from their machine.
The `prepublishOnly` hook still builds and lints first:

```sh
npm version <patch|minor|major>
npm publish
git push --follow-tags
```

Becoming a publisher requires npm owner rights (`npm owner add <user>
uba-bootstrap-theme`, run by an existing owner) and 2FA enabled on your npm
account.
