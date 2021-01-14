module.exports = {
  static: [
    {
      source: './src/fonts',
      target: './dist/fonts'
    },
    {
      source: './src/images',
      target: './dist/images'
    }
  ],
  sass: [
    {
      source: './src/styles/index.scss',
      target: './dist/css/uba-bootstrap-theme.css'
    }
  ],
  manifest: {
    target: "./dist/manifest.json",
    key: "short",
    baseURI: "../",
    webRoot: "./dist"
  },
}
