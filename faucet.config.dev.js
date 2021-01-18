module.exports = {
  static: [
    {
      source: './src/fonts',
      target: './dist/fonts'
    },
    {
      source: './src/images',
      target: './dist/images'
    },
    // Copy stuff for bootstrap documentation
    {
      source: './dist/css/uba-bootstrap-theme.css',
      target: './documentation/docs/4.3/dist/css/bootstrap.css'
    },
    {
      source: './dist/fonts',
      target: './documentation/docs/4.3/dist/fonts'
    },
    {
      source: './dist/images',
      target: './documentation/docs/4.3/dist/images'
    },
    {
      source: './bootstrap/dist/js',
      target: './documentation/docs/4.3/dist/js'
    },
    {
      source: './static',
      target: './documentation'
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
