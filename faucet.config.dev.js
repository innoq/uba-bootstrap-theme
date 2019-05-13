module.exports = {
  static: [
    {
      source: './dist/css/uba-bootstrap-theme.css',
      target: './documentation/dist/css/bootstrap.css'
    }
  ],
  sass: [
    {
      source: './src/styles/index.scss',
      target: './dist/css/uba-bootstrap-theme.css'
    }
  ]
}
