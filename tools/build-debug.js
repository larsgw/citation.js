const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const babelify = require('babelify')

browserify({ debug: true })
  .add(require.resolve('core-js/stable'))
  .add(require.resolve('regenerator-runtime/runtime'))
  .require('.', { expose: 'citation-js' })
  .transform(babelify, {
    global: true,
    ignore: [/node_modules\/(core-js|regenerator-runtime)/]
  })
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname, '../build/debug.citation.js')))
