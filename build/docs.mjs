// Build a local Bootstrap documentation site skinned with the UBA theme.
//
// The published npm package ships only `src` + `dist` (see `files` in package.json),
// so nothing in here — the Bootstrap clone, its dev dependencies, or the generated
// `documentation/` — ends up in the tarball that theme consumers install.
//
// Mechanism: Bootstrap's npm package does not include its docs site source, so we
// clone the upstream repo pinned to the EXACT version of the `bootstrap` dependency,
// build its (Astro-based) docs, then overwrite the framework `bootstrap[.min].css`
// the docs link to with the compiled UBA theme CSS. `docs.scss` only pulls in
// Bootstrap's functions/variables/mixins/grid, so the framework CSS is a standalone
// static asset we can swap — the same trick the old Hugo-based pipeline used.

import { execSync } from 'node:child_process'
import {
  existsSync, mkdirSync, rmSync, cpSync, readFileSync, writeFileSync, readdirSync, statSync,
} from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cloneDir = join(root, '.docs-build', 'bootstrap')  // gitignored working dir
const outDir = join(root, 'documentation')
const distCss = join(root, 'dist', 'css')

const version = JSON.parse(
  readFileSync(join(root, 'node_modules', 'bootstrap', 'package.json'), 'utf8'),
).version
const tag = `v${version}`

const run = (cmd, cwd = root) => {
  console.log(`\n$ ${cmd}${cwd === root ? '' : `  (in ${cwd})`}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

// Recursively collect files whose basename matches a predicate.
const find = (dir, match, acc = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) find(p, match, acc)
    else if (match(entry)) acc.push(p)
  }
  return acc
}

// 1. Compile the theme (CSS + fonts/images) so we have something to skin with.
run('npm run dist')

// 2. Clone Bootstrap pinned to the dependency version (cached across runs).
const marker = join(cloneDir, '.cloned-version')
const cloned = existsSync(marker) && readFileSync(marker, 'utf8').trim() === tag
if (!cloned) {
  rmSync(join(root, '.docs-build'), { recursive: true, force: true })
  mkdirSync(dirname(cloneDir), { recursive: true })
  run(`git clone --branch ${tag} --depth 1 https://github.com/twbs/bootstrap.git "${cloneDir}"`)
  writeFileSync(marker, tag)
} else {
  console.log(`\nReusing existing Bootstrap ${tag} clone in ${cloneDir}`)
}

// 3. Install the clone's own dev deps and build its docs (Astro → _site).
//    These deps live entirely inside .docs-build and never touch this package.
if (!existsSync(join(cloneDir, 'node_modules'))) run('npm ci', cloneDir)
run('npm run docs-build', cloneDir)

// 4. Publish the built site to ./documentation.
const builtSite = join(cloneDir, '_site')
if (!existsSync(builtSite)) {
  throw new Error(`Expected built docs at ${builtSite} — Bootstrap's docs-build output layout may have changed.`)
}
rmSync(outDir, { recursive: true, force: true })
cpSync(builtSite, outDir, { recursive: true })

// 5. Skin the docs: replace the framework CSS with the UBA theme CSS.
const ubaCss = readFileSync(join(distCss, 'uba-bootstrap-theme.css'), 'utf8')
const ubaCssMin = readFileSync(join(distCss, 'uba-bootstrap-theme.min.css'), 'utf8')
// Only the non-RTL framework files — the theme has no RTL build.
const cssTargets = find(outDir, (n) => /^bootstrap(\.min)?\.css$/.test(n))
if (cssTargets.length === 0) {
  throw new Error('No bootstrap[.min].css found in built docs — cannot skin. Output layout may have changed.')
}
const cssDirs = new Set()
for (const target of cssTargets) {
  writeFileSync(target, basename(target).includes('.min.') ? ubaCssMin : ubaCss)
  cssDirs.add(dirname(target))
  console.log(`skinned ${target.replace(outDir, 'documentation')}`)
}

// 6. Place fonts/images next to the swapped CSS so its relative url()s resolve
//    (UBA CSS references ../fonts and ../images relative to the css/ dir).
for (const cssDir of cssDirs) {
  const distDir = dirname(cssDir) // .../dist/css -> .../dist
  for (const asset of ['fonts', 'images']) {
    const srcAsset = join(root, 'dist', asset)
    if (existsSync(srcAsset)) cpSync(srcAsset, join(distDir, asset), { recursive: true })
  }
}

// 7. Strip Subresource Integrity attributes so the browser accepts our swapped CSS.
const html = find(outDir, (n) => n.endsWith('.html'))
const integrity = /\s+integrity=("[^"]*"|'[^']*')/g
for (const file of html) {
  const src = readFileSync(file, 'utf8')
  const out = src.replace(integrity, '')
  if (out !== src) writeFileSync(file, out)
}

// 8. Add the UBA-specific showcase pages. The custom site-header / navbar
//    variants, footer, sitemap and card variants are NOT part of Bootstrap's
//    docs, so ship the project's own showcase alongside. The pages load the
//    theme from /dist (absolute), so copy the compiled theme to the docs root.
//    Kept as standalone pages on purpose — no coupling to Bootstrap's Astro source.
cpSync(join(root, 'dist'), join(outDir, 'dist'), { recursive: true })
const ubaDir = join(outDir, 'uba')
mkdirSync(ubaDir, { recursive: true })
for (const page of ['showcase.html', 'components.html']) {
  const src = readFileSync(join(root, 'static', page), 'utf8')
  writeFileSync(join(ubaDir, page), src.replace(/\/static\//g, '/uba/')) // fix inter-page links
}
console.log('added UBA showcase at /uba/showcase.html (custom navbar/site-header) and /uba/components.html')

console.log(`\n✓ UBA-styled Bootstrap ${tag} docs built in ./documentation`)
console.log('  Standard components (UBA-styled):  /docs/5.3/  ·  UBA-specific components:  /uba/showcase.html')
console.log('  Serve them with a static server, e.g.:  python3 -m http.server -d documentation 8080')
