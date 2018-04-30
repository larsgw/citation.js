var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var babelify = require('babelify')
var glob = require('glob')

browserify()
  .exclude(['citation-js'])
  .add(glob.sync('test/*.spec.js'))
  .transform(babelify, {
    global: true,
    ignore: ['node_modules/expect.js/']
  })
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname, '../build/test.citation.js')))
