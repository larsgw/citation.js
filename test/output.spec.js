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
const customNumberedTemplate = `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">
  <citation collapse="id">
    <sort>
      <key variable="id"/>
    </sort>
    <layout delimiter=", ">
      <group prefix="[" suffix="]" delimiter=", ">
        <text variable="id"/>
      </group>
    </layout>
  </citation>
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

const citeMap = new WeakMap()

function testCaseGenerator (cases) {
  return function () {
    for (let name in cases) {
      let testCase = cases[name]

      // General test case
      if (Array.isArray(testCase)) {
        let [input, format, options, expected] = testCase
        if (!citeMap.has(input)) {
          citeMap.set(input, Cite(input))
        }
        input = citeMap.get(input)

        it(name, () => {
          let actual = input.format(format, options)
          let comparison = typeof actual === 'object' ? 'eql' : 'be'

          if (typeof actual === 'string') {
            actual = actual.trim()
          }

          expect(actual).to[comparison](expected)
        })
      // Custom test case
      } else if (typeof testCase === 'function') {
        it(name, testCase)
      // Nested test case
      } else if (typeof testCase === 'object') {
        describe(name, testCaseGenerator(testCase))
      // Nothing
      } else {
        continue
      }
    }
  }
}

Cite.CSL.register.addTemplate('custom', customTemplate)
Cite.CSL.register.addTemplate('customNumbered', customNumberedTemplate)
Cite.CSL.register.addLocale('custom', customLocale)

const cases = {
  csl: {
    bibliography: {
      html: {
        'default built-in template':
          [input.simple, 'bibliography', {format: 'html', template: 'apa'}, output.csl.html.apa],
        'non-default built-in template':
          [input.simple, 'bibliography', {format: 'html', template: 'vancouver'}, output.csl.html.vancouver],
        'non-existent template':
          [input.simple, 'bibliography', {format: 'html', template: 'foo'}, output.csl.html.apa],
        'non-existent locale':
          [input.simple, 'bibliography', {format: 'html', lang: 'foo'}, output.csl.html.apa],

        'custom template': {
          'registers the template': () => {
            expect(Cite.CSL.register.hasTemplate('custom')).to.be(true)
            expect(Cite.CSL.register.getTemplate('custom')).to.be(customTemplate)
          },
          'outputs correctly':
            [input.simple, 'bibliography', {format: 'html', template: 'custom'}, output.csl.html.title]
        },

        'custom locale': {
          'registers the template': () => {
            expect(Cite.CSL.register.hasLocale('custom')).to.be(true)
            expect(Cite.CSL.register.getLocale('custom')).to.be(customLocale)
          },
          'outputs correctly':
            [input.locale, 'bibliography', {format: 'html', lang: 'custom'}, output.csl.html.locale]
        },

        'pre/append': {
          static: [
            input.simple,
            'bibliography',
            {format: 'html', template: 'apa', prepend: 'a', append: 'b'},
            output.csl.html.wrappedStatic
          ],
          dynamic: [
            input.simple,
            'bibliography',
            {format: 'html', template: 'apa', prepend: ({issue}) => issue, append: ({volume}) => volume},
            output.csl.html.wrappedDynamic
          ]
        }
      },

      'plain text': {
        'default built-in template':
          [input.simple, 'bibliography', {template: 'apa'}, output.csl.apa],
        'non-default built-in template':
          [input.simple, 'bibliography', {template: 'vancouver'}, output.csl.vancouver],
        'non-existent template':
          [input.simple, 'bibliography', {template: 'foo'}, output.csl.apa],
        'non-existent locale':
          [input.simple, 'bibliography', {lang: 'foo'}, output.csl.apa],

        'custom template': {
          'registers the template': () => {
            expect(Cite.CSL.register.hasTemplate('custom')).to.be(true)
            expect(Cite.CSL.register.getTemplate('custom')).to.be(customTemplate)
          },
          'outputs correctly':
            [input.simple, 'bibliography', {template: 'custom'}, output.csl.title]
        },

        'custom locale': {
          'registers the template': () => {
            expect(Cite.CSL.register.hasLocale('custom')).to.be(true)
            expect(Cite.CSL.register.getLocale('custom')).to.be(customLocale)
          },
          'outputs correctly':
            [input.locale, 'bibliography', {lang: 'custom'}, output.csl.locale]
        }
      }
    },
    citation: {
      works: [input.citation, 'citation', {entry: ['1', '2']}, '(“a,” 2011; d & h, 2012)'],
      'works for single entries': [input.citation, 'citation', {entry: '2'}, '(d & h, 2012)'],
      'defaults to all entries': [input.citation, 'citation', undefined, '(“a,” 2011; d & h, 2012; f, 2013)'],
      'works for single entries with numbered templates': [input.citation, 'citation', {entry: '3', template: 'customNumbered'}, '[3]'],
      'works for multiple entries with numbered templates': [input.citation, 'citation', {entry: ['2', '3'], template: 'customNumbered'}, '[2], [3]']
    }
  },
  else: {
    data: {
      'plain text': [input.simple, 'data', undefined, JSON.stringify(input.simple, null, 2)],
      'object': [input.simple, 'data', {format: 'object'}, input.simple]
    },
    label: {
      'normal': [input.simple, 'label', undefined, {[input.simple[0].id]: 'Hall1957Correlation'}],
      'with year-suffix': [input.editor, 'label', undefined, {[input.editor[0].id]: 'Vrandečić2013a'}],
      'with own label': [input.label, 'label', undefined, {[input.label[0].id]: 'foo'}]
    }
  },
  bibtex: {
    bibtex: {
      'plain text': [input.simple, 'bibtex', undefined, output.bibtex.plain],
      'with rich text title': [input.rich, 'bibtex', undefined, output.bibtex.rich],
      'with editor': [input.editor, 'bibtex', undefined, output.bibtex.editor],
      'with own label': [input.label, 'bibtex', undefined, output.bibtex.label],
      'object': [input.simple, 'bibtex', {format: 'object'}, output.bibtex.json]
    },
    bibtxt: [input.simple, 'bibtxt', undefined, output.bibtex.bibtxt]
  },
  ris: {
    'plain text': [input.simple, 'ris', undefined, output.ris.simple],
    'with accessed': [input.editor, 'ris', {format: 'object'}, output.ris.editor],
    'object': [input.simple, 'ris', {format: 'object'}, output.ris.json]
  }
}

describe('output', testCaseGenerator(cases))
