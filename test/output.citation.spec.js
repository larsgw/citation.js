/* global require, module, describe, it, expect */

const Cite = require('../lib/index.js')
const test = require('./output.json')

const customTemplate = `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">
  <bibliography>
    <layout>
      <text variable="title"/>
    </layout>
  </bibliography>
</style>`

const testCaseGenerator = function (data, options, output, {
  callback = v => v,
  msg = 'outputs correctly'
} = {}) {
  return function () {
    let out = callback(data.get(options))
    out = typeof out === 'string' ? out.trim() : out

    it(msg, function () {
      expect(out)[typeof out === 'object' ? 'toEqual' : 'toBe'](output)
    })
  }
}

module.exports = function () {
  const data = new Cite(test.input.csl.simple)

  describe('Formatted CSL', function () {
    describe('html', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, {
        format: 'string',
        type: 'html',
        style: 'citation-apa'
      }, test.output.csl.html.apa))

      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, {
        format: 'string',
        type: 'html',
        style: 'citation-vancouver'
      }, test.output.csl.html.vancouver))

      describe('custom template', function () {
        testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-custom',
          template: customTemplate
        }, test.output.csl.html.title)()

        testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-custom'
        }, test.output.csl.html.title, {msg: 'registers for subsequent calls'})()
      })
    })

    describe('plain text', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, {
        format: 'string',
        type: 'string',
        style: 'citation-apa'
      }, test.output.csl.apa))

      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, {
        format: 'string',
        type: 'string',
        style: 'citation-vancouver'
      }, test.output.csl.vancouver))

      describe('custom template', function () {
        testCaseGenerator(data, {
          format: 'string',
          type: 'string',
          style: 'citation-custom',
          template: customTemplate
        }, test.output.csl.title)()

        testCaseGenerator(data, {
          format: 'string',
          type: 'string',
          style: 'citation-custom'
        }, test.output.csl.title, {msg: 'registers for subsequent calls'})()
      })
    })
  })

  describe('CSL-JSON', function () {
    describe('plain text', testCaseGenerator(data, {format: 'string'}, test.input.csl.simple, { callback: JSON.parse }))
    describe('object', testCaseGenerator(data, undefined, test.input.csl.simple))
  })

  describe('BibTeX', function () {
    describe('plain text', testCaseGenerator(data, {
      format: 'string',
      type: 'string',
      style: 'bibtex'
    }, test.output.bibtex.plain, { callback: v => v.replace(/\s+/g, ' ') }))

    describe('JSON', testCaseGenerator(data, {style: 'bibtex'}, test.output.bibtex.json))

    describe('Bib.TXT', testCaseGenerator(data, {
      format: 'string',
      type: 'string',
      style: 'bibtxt'
    }, test.output.bibtex.bibtxt))
  })
}
