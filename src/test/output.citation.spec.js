/* global require, module, describe, it, expect */

const Cite = require('./cite')
const test = require('./output.json')

const customTemplate = `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">
  <bibliography>
    <layout>
      <text variable="title"/>
    </layout>
  </bibliography>
</style>`
const customLocale = `<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="custom">
  <style-options punctuation-in-quote="true"/>
  <date form="text">
    <date-part name="month" suffix=" "/>
    <date-part name="day" suffix=", "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="no date" form="short">custom</term>
  </terms>
</locale>`

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

  describe('formatted CSL', function () {
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
        const reg = Cite.CSL.register
        reg.addTemplate('custom', customTemplate)

        it('registers the template', function () {
          expect(reg.hasTemplate('custom')).toBe(true)
          expect(reg.getTemplate('custom')).toBe(customTemplate)
        })

        testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-custom'
        }, test.output.csl.html.title, {msg: 'uses the template'})()
      })

      describe('custom locale', function () {
        const reg = Cite.CSL.register
        reg.addLocale('custom', customLocale)

        it('registers the locale', function () {
          expect(reg.hasLocale('custom')).toBe(true)
          expect(reg.getLocale('custom')).toBe(customLocale)
        })

        testCaseGenerator(new Cite({id: 'a', type: 'article-journal'}), {
          format: 'string',
          type: 'html',
          style: 'citation-apa',
          lang: 'custom'
        }, test.output.csl.html.locale, {msg: 'uses the locale'})()
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
        const reg = Cite.CSL.register
        reg.addTemplate('custom', customTemplate)

        it('registers the template', function () {
          expect(reg.hasTemplate('custom')).toBe(true)
          expect(reg.getTemplate('custom')).toBe(customTemplate)
        })

        testCaseGenerator(data, {
          format: 'string',
          type: 'string',
          style: 'citation-custom'
        }, test.output.csl.title, {msg: 'uses the template'})()
      })

      describe('custom locale', function () {
        const reg = Cite.CSL.register
        reg.addLocale('custom', customLocale)

        it('registers the locale', function () {
          expect(reg.hasLocale('custom')).toBe(true)
          expect(reg.getLocale('custom')).toBe(customLocale)
        })

        testCaseGenerator(new Cite({id: 'a', type: 'article-journal'}), {
          format: 'string',
          type: 'string',
          style: 'citation-apa',
          lang: 'custom'
        }, '(custom).', {msg: 'uses the locale'})()
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
