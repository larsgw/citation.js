var fs = require('fs')
var browserify = require('browserify')
var babelify = require('babelify')

browserify({debug: true})
  .require('./src/index.js', {expose: 'citation-js'})
  .transform(babelify, {global: true})
  .bundle()
  .pipe(fs.createWriteStream(__dirname + '/../build/debug.citation.js'))
