// Mirrors Bootstrap's build/postcss.config.mjs (without the RTL variant, which
// this LTR-only theme does not need).
const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

export default () => {
  return {
    map: mapConfig,
    plugins: {
      autoprefixer: {
        cascade: false
      }
    }
  }
}
