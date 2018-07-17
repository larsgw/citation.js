/* eslint-env mocha */

import expect from 'expect.js'
import Cite from './citation'
import input from './input/get'
import output from './output/get'

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
  return () => {
    let out = callback(data.get(options))
    out = typeof out === 'string' ? out.trim() : out

    it(msg, () => expect(out).to[typeof out === 'object' ? 'eql' : 'be'](output))
  }
}

const defaultOpts = Cite.prototype.defaultOptions
const opts = (format, type, style, lang = defaultOpts.lang) => ({format, type, style, lang})

describe('output', () => {
  const data = new Cite(input.csl.simple)

  describe('CSL bibliography', () => {
    describe('html', () => {
      describe('default built-in template (APA)',
        testCaseGenerator(data, opts('string', 'html', 'citation-apa'), output.csl.html.apa))

      describe('non-default built-in template (Vancouver)',
        testCaseGenerator(data, opts('string', 'html', 'citation-vancouver'), output.csl.html.vancouver))

      describe('non-existent template',
        testCaseGenerator(data, opts('string', 'html', 'citation-larsgw'), output.csl.html.apa))

      describe('non-existent locale',
        testCaseGenerator(data, opts('string', 'html', 'citation-apa', 'larsgw'), output.csl.html.apa))

      describe('custom template', () => {
        Cite.CSL.register.addTemplate('custom', customTemplate)

        it('registers the template', () => {
          expect(Cite.CSL.register.hasTemplate('custom')).to.be(true)
          expect(Cite.CSL.register.getTemplate('custom')).to.be(customTemplate)
        })

        testCaseGenerator(data, opts('string', 'html', 'citation-custom'), output.csl.html.title)()
      })

      describe('custom locale', () => {
        const data = new Cite(input.csl.locale)
        Cite.CSL.register.addLocale('custom', customLocale)

        it('registers the locale', () => {
          expect(Cite.CSL.register.hasLocale('custom')).to.be(true)
          expect(Cite.CSL.register.getLocale('custom')).to.be(customLocale)
        })

        testCaseGenerator(data, opts('string', 'html', 'citation-apa', 'custom'), output.csl.html.locale)()
      })

      describe('pre/append', () => {
        context('static',
          testCaseGenerator(
            data,
            {format: 'string', type: 'html', style: 'citation-apa', append: 'b', prepend: 'a'},
            output.csl.html.wrappedStatic))

        context('dynamic',
          testCaseGenerator(
            data,
            {format: 'string', type: 'html', style: 'citation-apa', append: ({volume}) => volume, prepend: ({issue}) => issue},
            output.csl.html.wrappedDynamic))
      })
    })

    describe('plain text', () => {
      describe('default built-in template (APA)',
        testCaseGenerator(data, opts('string', 'string', 'citation-apa'), output.csl.apa))

      describe('non-default built-in template (Vancouver)',
        testCaseGenerator(data, opts('string', 'string', 'citation-vancouver'), output.csl.vancouver))

      describe('non-existent template',
        testCaseGenerator(data, opts('string', 'string', 'citation-larsgw'), output.csl.apa))

      describe('non-existent locale',
        testCaseGenerator(data, opts('string', 'string', 'citation-apa', 'larsgw'), output.csl.apa))

      describe('custom template', () => {
        Cite.CSL.register.addTemplate('custom', customTemplate)

        it('registers the template', () => {
          expect(Cite.CSL.register.hasTemplate('custom')).to.be(true)
          expect(Cite.CSL.register.getTemplate('custom')).to.be(customTemplate)
        })

        testCaseGenerator(data, opts('string', 'string', 'citation-custom'), output.csl.title)()
      })

      describe('custom locale', () => {
        const data = new Cite(input.csl.locale)
        Cite.CSL.register.addLocale('custom', customLocale)

        it('registers the locale', () => {
          expect(Cite.CSL.register.hasLocale('custom')).to.be(true)
          expect(Cite.CSL.register.getLocale('custom')).to.be(customLocale)
        })

        testCaseGenerator(data, opts('string', 'string', 'citation-apa', 'custom'), '(Custom).')()
      })
    })
  })

  describe('CSL citation', function () {
    const data = new Cite([{
      id: '1',
      type: 'article-journal',
      title: 'a',
      issued: {'date-parts': [[2011]]}
    }, {
      id: '2',
      type: 'article-journal',
      title: 'b',
      author: [{
        family: 'd',
        given: 'c'
      }, {
        literal: 'h'
      }],
      issued: {'date-parts': [[2012]]}
    }, {
      id: '3',
      type: 'article-journal',
      title: 'e',
      author: [{
        family: 'f',
        given: 'g'
      }],
      issued: {'date-parts': [[2013]]}
    }])

    it('works', function () {
      let input = data.format('citation', {entry: ['1', '2']})
      let output = '(“a,” 2011; d & h, 2012)'
      expect(input).to.be(output)
    })
    it('works for single entries', function () {
      let input = data.format('citation', {entry: '2'})
      let output = '(d & h, 2012)'
      expect(input).to.be(output)
    })
    it('defaults to all entries', function () {
      let input = data.format('citation')
      let output = '(“a,” 2011; d & h, 2012; f, 2013)'
      expect(input).to.be(output)
    })
  })

  describe('CSL-JSON', () => {
    describe('plain text', testCaseGenerator(data, {format: 'string'}, input.csl.simple, { callback: JSON.parse }))
    describe('object', testCaseGenerator(data, undefined, input.csl.simple))
  })

  describe('BibTeX', () => {
    describe('plain text', testCaseGenerator(data, opts('string', 'string', 'bibtex'), output.bibtex.plain, { callback: v => v.replace(/\s+/g, ' ') }))

    describe('with rich text title', testCaseGenerator(
      Cite([
        {title: '<i>i</i><b>b</b><sc>sc</sc><sup>sup</sup><sub>sub</sub>'},
        {title: '<span style="font-variant:small-caps;">sc</span>'},
        {title: '<span class="nocase">sc</span>'}
      ]),
      opts('string', 'string', 'bibtex'),
      output.bibtex.rich,
      { callback: v => v.replace(/\s+/g, ' ') }
    ))

    describe('JSON', testCaseGenerator(data, {style: 'bibtex'}, output.bibtex.json))

    describe('Bib.TXT', testCaseGenerator(data, opts('string', 'string', 'bibtxt'), output.bibtex.bibtxt))
  })

  describe('RIS', () => {
    describe('plain text', () => {
      it('outputs correctly', () => {
        expect(data.format('ris')).to.be(output.ris.simple)
      })
    })
  })
})
