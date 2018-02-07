var fs = require('fs')
var browserify = require('browserify')
var babelify = require('babelify')

browserify()
  .require('./src/index.js', {expose: 'citation-js'})
  .transform(babelify, {global: true})
  .bundle()
  .pipe(fs.createWriteStream(__dirname + '/../build/citation.js'))
