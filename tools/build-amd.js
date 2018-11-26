var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var babelify = require('babelify')
var transformDerequire = require('./transform-derequire')

browserify(['./src/index.js'], {
    debug: true,
    standalone : 'Cite'
  })
  .transform(transformDerequire,{global: true})
  .transform(babelify, {global: true})
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname, '../build/citation.amd.js')))
