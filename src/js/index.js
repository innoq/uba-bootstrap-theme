// Bootstrap's JavaScript, re-exported through the theme.
//
// Consumers depend on the theme, not on Bootstrap directly — so the pinned
// Bootstrap version lives in one place (this package's dependencies) and apps
// stay decoupled from the internal layout.
//
// Usage in a bundler (esbuild/webpack/vite):
//   import 'uba-bootstrap-theme/src/js/index'              // data-API + all plugins
//   import { Modal } from 'uba-bootstrap-theme/src/js/index' // a single plugin class
//
// The bare `import` keeps Bootstrap's data-API side effects (auto-wiring of
// data-bs-toggle etc.) even when only the side effect is imported. For plain
// <script> consumers the prebuilt bundle is copied to dist/js/ (see build/copy-assets.mjs).
import 'bootstrap'

export * from 'bootstrap'
