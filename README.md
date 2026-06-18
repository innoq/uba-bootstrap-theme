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
*
* Install node v20 or higher (LTS recommended)

* Clone project `git clone git@github.com:innoq/uba-bootstrap-theme.git`
* Go into the project folder `cd uba-bootstrap-theme`
* Init the Bootstrap submodule `git submodule update --init` (only needed the
  very first time)
* Install Bootstap's documentation pages `npm run install-docs`
* Compile styles and serve documentation `npm start`

Now you should see the Bootstrap documentation pages with UBA styling applied.
`npm start` incorporates a watcher, so you can write code and see your
changes immediately in the browser.

## Releasing

A release is published to npm by a maintainer bumping the version and
publishing the corresponding GitHub Release. The actual `npm publish` runs in
GitHub Actions (`.github/workflows/release.yml`) and authenticates to npm via
[trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) — no npm
token is stored anywhere. The build (`npm run dist`) and linting (`npm test`)
run automatically via the `prepublishOnly` hook.

```sh
npm version <patch|minor|major>   # bumps package.json + creates a git tag
git push --follow-tags
gh release create vX.Y.Z --generate-notes
```

Publishing the GitHub Release triggers the workflow, which builds and publishes
the package to npm.

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
