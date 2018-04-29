var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var babelify = require('babelify')

browserify()
  .exclude(['citation-js'])
  .add('./test/wrapper.js')
  .transform(babelify, {
    global: true,
    ignore: ['node_modules/expect.js/']
  })
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname, '../build/test.citation.js')))
