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
