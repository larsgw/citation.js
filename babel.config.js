module.exports = {
  presets: [
    ['@babel/env', { targets: {
      browsers: [
        '> 0.5%',
        'last 5 versions',
        'ie >= 10'
      ] }
    }]
  ],
  comments: false
}
