/* eslint-env mocha */

import syncRequest from 'sync-request'

import expect from 'expect.js'
import Cite from './citation'
import input from './input/parse'
import output from './output/parse'
input.wd.simple = require('./Q21972834.json')
input.wd.author = require('./Q27795847.json')

// start sync-request beforehand (interferes with the reporter otherwise)
try { syncRequest() } catch (e) { }

const wikidataTestCaseOptions = {
  callback: ([data]) => data.replace(/[&?]origin=\*/, ''),
  link: true
}
const doiLinkTestCaseOptions = {link: true}
const doiTestCaseOptions = {link: true, callback: ({title}) => title}

const configs = {
  // @wikdiata
  '@wikidata/id': [input.wd.id, output.wd.api[0], wikidataTestCaseOptions],
  '@wikidata/list+text': {
    'separated by spaces': [input.wd.list.space, output.wd.api[1], wikidataTestCaseOptions],
    'separated by newlines': [input.wd.list.newline, output.wd.api[1], wikidataTestCaseOptions],
    'separated by commas': [input.wd.list.comma, output.wd.api[1], wikidataTestCaseOptions]
  },
  '@wikidata/url': [input.wd.url, output.wd.id, {link: true}],
  '@wikidata/object': {
    'without linked authors': [input.wd.simple, output.wd.simple],
    'with linked authors': [input.wd.author, output.wd.author]
  },

  // @doi
  '@doi/id': [input.doi.id, output.doi.api[0], doiLinkTestCaseOptions],
  '@doi/api': [input.doi.url, output.doi.simple.title, doiTestCaseOptions],
  '@doi/list+text': {
    'separated by spaces': [input.doi.list.space, output.doi.api[1], doiLinkTestCaseOptions],
    'separated by newlines': [input.doi.list.newline, output.doi.api[1], doiLinkTestCaseOptions]
  },

  // @bibtex
  '@bibtex/text': {
    'with one simple entry': [input.bibtex.simple, output.bibtex.simple],
    'with whitespace and unknown fields': [input.bibtex.whitespace, output.bibtex.whitespace],
    'with unicode and capitalized types': [input.bibtex.unicode, [output.bibtex.unicode]],
    'with literals': [input.bibtex.literals, output.bibtex.literals],
    'with year and month without date': [input.bibtex.yearMonthNeeded, output.bibtex.yearMonthNeeded],
    'with year and month with date': [input.bibtex.yearMonth, output.bibtex.yearMonth]
  },
  '@bibtex/object': [input.bibtex.json, output.bibtex.simple],
  '@bibtxt/text': {
    'with one simple entry': [input.bibtxt.simple, [output.bibtxt]],
    'with multiple entries': [input.bibtxt.multiple, [output.bibtxt, output.bibtex.simple[0]]],
    'with whitespace': [input.bibtxt.whitespace, [output.bibtxt]]
  },

  // @bibjson
  '@bibjson/object': [input.bibjson.simple, output.bibjson.simple],

  // @csl
  '@csl/object': [input.csl.simple, [input.csl.simple]],
  '@csl/list+object': [input.array.simple, input.array.simple],

  // @else
  '@else/json': {
    'as JSON string': [JSON.stringify(input.csl.simple), [input.csl.simple]],
    'as JS Object string': [input.csl.string, [input.csl.simple]],
    'with a syntax error': ['{"hi"}', []]
  },
  '@else/list+object': [input.array.nested, input.array.simple],

  // @empty
  '@empty/text': ['', []],
  '@empty/whitespace+text': ['   \t\n \r  ', []],
  '@empty': {
    '(null)': [null, []],
    '(undefined)': [undefined, []]
  }
}

const testCaseGenerator = (type, input, output, opts = {}) => {
  return function () {
    const {requirements = {}, callback, link = false} = opts
    const methods = Cite.parse.input
    const method = link ? methods.chainLink : methods.chain

    it('handles input type', () => {
      expect(methods.type(input)).to.be(type)
    })

    it('parses input correctly', () => {
      let data = method(input, {generateGraph: false})
      if (typeof callback === 'function') {
        data = callback(data)
      }
      expect(data).to.eql(output)
    })

    for (const requirement in requirements) {
      const predicate = requirements[requirement]
      it(requirement, () => predicate(input, output, opts))
    }
  }
}

describe('input', function () {
  this.timeout(4000)

  describe('modules', function () {
    for (const spec in configs) {
      const specConfig = configs[spec]

      let callback
      if (Array.isArray(specConfig)) {
        callback = testCaseGenerator(spec, ...specConfig)
      } else {
        callback = function () {
          for (const specContext in specConfig) {
            context(specContext, testCaseGenerator(spec, ...specConfig[specContext]))
          }
        }
      }

      describe(spec, callback)
    }
  })

  describe('interface', function () {
    const ref = '@test'
    const type = `${ref}/foo`
    const subType = `${ref}/bar`
    const data = [{foo: 1}]
    const parse = () => data
    const parseAsync = async () => data

    describe('plugin', function () {
      afterEach(function () { Cite.parse.removePlugin(ref) })

      it('registers', function () {
        Cite.parse.addPlugin(ref)
        expect(Cite.parse.hasPlugin(ref)).to.be.ok()
      })
      it('works', function () {
        Cite.parse.addPlugin(ref, {[type]: {parseType: {predicate: /foo/}}})
        expect(Cite.parse.hasFormat(type)).to.ok()
        expect(Cite.parse.type('foo')).to.be(type)
      })
      it('removes', function () {
        Cite.parse.addPlugin(ref, {[type]: {parseType: {predicate: /foo/}}})
        Cite.parse.removePlugin(ref)
        expect(Cite.parse.hasFormat(type)).to.not.be.ok()
        expect(Cite.parse.hasTypeParser(type)).to.not.be.ok()
        expect(Cite.parse.hasDataParser(type)).to.not.be.ok()
        expect(Cite.parse.hasDataParser(type, true)).to.not.be.ok()
        expect(Cite.parse.type('foo')).to.not.be(type)
      })
      it('removes only relevant parts', function () {
        Cite.parse.addPlugin(ref, {[type]: {parse, parseAsync, parseType: {predicate: /foo/}}})
        Cite.parse.addPlugin('@other-ref', {[type]: {parseType: {predicate: /bar/}}})
        Cite.parse.removePlugin(ref)
        expect(Cite.parse.hasFormat(type)).to.be.ok()
        expect(Cite.parse.hasTypeParser(type)).to.be.ok()
        expect(Cite.parse.hasDataParser(type)).to.not.be.ok()
        expect(Cite.parse.hasDataParser(type, true)).to.not.be.ok()
        expect(Cite.parse.type('foo')).to.not.be(type)
      })
    })

    describe('format', function () {
      describe('typeParser', function () {
        afterEach(function () { Cite.parse.removePlugin(ref) })

        it('registers', function () {
          Cite.parse.addFormat(type, {parseType: {}}, ref)
          expect(Cite.parse.hasTypeParser(type)).to.be.ok()
        })
        it('works', function () {
          Cite.parse.addFormat(type, {parseType: {predicate: /foo/}}, ref)
          expect(Cite.parse.type('foo')).to.be(type)
        })
        it('removes', function () {
          Cite.parse.addFormat(type, {parseType: {}}, ref)
          Cite.parse.removeFormat(type)
          expect(Cite.parse.hasTypeParser(type)).to.not.be.ok()
          expect(Cite.parse.type('foo')).to.not.be(type)
        })

        context('subtypes', function () {
          afterEach(function () { Cite.parse.removePlugin(ref) })

          it('registers', function () {
            Cite.parse.addFormat(type, {parseType: {}}, ref)
            Cite.parse.addFormat(subType, {parseType: {extends: type}}, ref)
            expect(Cite.parse.hasTypeParser(type)).to.be.ok()
            expect(Cite.parse.hasTypeParser(subType)).to.be.ok()
          })
          it('waits on parent type', function () {
            Cite.parse.addFormat(subType, {parseType: {extends: type, predicate: /foo/}}, ref)
            Cite.parse.addFormat(type, {parseType: {predicate: /fo/}}, ref)
            expect(Cite.parse.hasTypeParser(type)).to.be.ok()
            expect(Cite.parse.hasTypeParser(subType)).to.be.ok()
            expect(Cite.parse.type('foo')).to.be(subType)
          })
          it('works', function () {
            Cite.parse.addFormat(type, {parseType: {predicate: /fo/}}, ref)
            Cite.parse.addFormat(subType, {parseType: {extends: type, predicate: /foo/}}, ref)
            expect(Cite.parse.type('foo')).to.be(subType)
          })
          it('delegates to parent type', function () {
            Cite.parse.addFormat(type, {parseType: {predicate: /fo/}}, ref)
            Cite.parse.addFormat(subType, {parseType: {extends: type, predicate: /foobar/}}, ref)
            expect(Cite.parse.type('foo')).to.be(type)
          })
          it('removes', function () {
            Cite.parse.addFormat(type, {parseType: {predicate: /fo/}}, ref)
            Cite.parse.addFormat(subType, {parseType: {extends: type, predicate: /foo/}}, ref)
            Cite.parse.removeFormat(subType)
            expect(Cite.parse.hasTypeParser(subType)).to.not.be.ok()
            expect(Cite.parse.type('foo')).to.not.be(subType)
          })
        })
      })
      describe('dataParser', function () {
        afterEach(function () { Cite.parse.removePlugin(ref) })

        it('registers', function () {
          Cite.parse.addFormat(type, {parse}, ref)
          expect(Cite.parse.hasDataParser(type)).to.be.ok()
        })
        it('works', function () {
          Cite.parse.addFormat(type, {parse}, ref)
          expect(Cite.parse.data('foo', type)).to.eql(data)
        })
        it('removes', function () {
          Cite.parse.addFormat(type, {parse}, ref)
          Cite.parse.removeFormat(type)
          expect(Cite.parse.hasDataParser(type)).to.not.be.ok()
          expect(Cite.parse.data('foo', type)).to.not.be(type)
        })

        context('async', function () {
          afterEach(function () { Cite.parse.removePlugin(ref) })

          it('registers', function () {
            Cite.parse.addFormat(type, {parseAsync}, ref)
            expect(Cite.parse.hasDataParser(type, true)).to.be.ok()
          })
          it('works', async function () {
            Cite.parse.addFormat(type, {parseAsync}, ref)
            expect(await Cite.parse.dataAsync('foo', type)).to.eql(data)
          })
          it('removes', async function () {
            Cite.parse.addFormat(type, {parseAsync}, ref)
            Cite.parse.removeFormat(type)
            expect(Cite.parse.hasDataParser(type, true)).to.not.be.ok()
            expect(await Cite.parse.dataAsync('foo', type)).to.not.be(type)
          })
        })
      })
    })
  })
})
