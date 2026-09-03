// Copies static assets (fonts, images) into dist/ so the published package and
// the standalone CSS are self-contained. Layout mirrors the `uba-asset-url()`
// base (`../`): dist/css/*.css references ../fonts/* and ../images/*.
import { cpSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const copies = [
  ["src/fonts", "dist/fonts"],
  ["src/images", "dist/images"],
  // Bootstrap's prebuilt JS bundle, so the published package and the static
  // demo pages are self-contained for plain <script> consumers. Bundler-based
  // consumers import the ESM via src/js/index.js instead.
  ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", "dist/js/bootstrap.bundle.min.js"],
  ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map", "dist/js/bootstrap.bundle.min.js.map"]
]

for (const [from, to] of copies) {
  const target = resolve(root, to)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(resolve(root, from), target, { recursive: true })
  console.log(`copied ${from} -> ${to}`)
}
