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
        expect(Cite.parse.type('bar')).to.be(type)
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
        it('removes non-existing', function () {
          expect(Cite.parse.removeFormat).withArgs(type).not.to.throwException()
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

        describe('class', function () {
          var {TypeParser} = Cite.parse.util

          it('can be combined', function () {
            var {predicate} = new TypeParser({
              predicate: object => Object.keys(object).length === 2,
              propertyConstraint: {props: 'foo'}
            })
            expect(predicate({foo: 1, bar: 2})).to.be.ok()
            expect(predicate({bar: 1, baz: 2})).not.to.be.ok()
            expect(predicate({foo: 1})).not.to.be.ok()
            expect(predicate({})).not.to.be.ok()
          })
          it('validates', function () {
            var instance
            instance = new TypeParser({})
            expect(instance.validate.bind(instance)).not.to.throwException()
            instance = new TypeParser(1)
            expect(instance.validate.bind(instance)).to.throwException(e => {
              expect(e).to.be.a(TypeError)
              expect(e).to.match(/typeParser was number; expected object/)
            })
          })

          describe('dataType', function () {
            it('outputs properly', function () {
              var instance = new TypeParser({dataType: 'SimpleObject'})
              expect(instance.dataType).to.be('SimpleObject')
            })
            it('can be inferred', function () {
              expect((new TypeParser({predicate: /foo/})).dataType).to.be('String')
              expect((new TypeParser({elementConstraint: '@foo/bar'})).dataType).to.be('Array')
              expect((new TypeParser({})).dataType).to.be('Primitive')
              expect((new TypeParser({dataType: 'Array', predicate: /foo/})).dataType).to.be('Array')
            })
            it('validates', function () {
              var instance = new TypeParser({dataType: 'String'})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('invalidates non-datatypes', function () {
              var instance = new TypeParser({dataType: 'Blue'})
              expect(instance.validate.bind(instance)).to.throwException(e => {
                expect(e).to.be.a(RangeError)
                expect(e).to.match(/dataType was Blue; expected one of/)
              })
            })
            it('invalidates non-strings', function () {
              var instance = new TypeParser({dataType: 12})
              expect(instance.validate.bind(instance)).to.throwException(e => {
                expect(e).to.be.a(RangeError)
                expect(e).to.match(/dataType was 12; expected one of/)
              })
            })
          })
          describe('predicate', function () {
            it('outputs properly for functions', function () {
              var {predicate} = new TypeParser({predicate: a => a === 'foo'})
              expect(predicate('foo')).to.be.ok()
              expect(predicate('bar')).not.to.be.ok()
            })
            it('outputs properly for regex', function () {
              var {predicate} = new TypeParser({predicate: /^foo$/})
              expect(predicate('foo')).to.be.ok()
              expect(predicate('bar')).not.to.be.ok()
            })
            it('validates functions', function () {
              var instance = new TypeParser({predicate: function () {}})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('validates regex', function () {
              var instance = new TypeParser({predicate: /a/})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('invalidates non-predicates', function () {
              var instance = new TypeParser({predicate: 'Blue'})
              expect(instance.validate.bind(instance)).to.throwException(e => {
                expect(e).to.be.a(TypeError)
                expect(e).to.match(/predicate was string; expected RegExp or function/)
              })
            })
          })
          describe('propertyConstraint', function () {
            it('outputs properly for one prop', function () {
              var {predicate} = new TypeParser({propertyConstraint: {
                props: 'foo'
              }})
              expect(predicate({foo: 1, bar: 2})).to.be.ok()
              expect(predicate({foo: 1})).to.be.ok()
              expect(predicate({})).not.to.be.ok()
              expect(predicate({bar: 2})).not.to.be.ok()
            })
            it('outputs properly for prop predicates', function () {
              var {predicate} = new TypeParser({propertyConstraint: {
                props: ['foo'],
                value: value => value === 1
              }})
              expect(predicate({foo: 1})).to.be.ok()
              expect(predicate({foo: 2})).not.to.be.ok()
              expect(predicate({})).not.to.be.ok()
              expect(predicate({bar: 1})).not.to.be.ok()
            })
            it('outputs properly for match=every', function () {
              var {predicate} = new TypeParser({propertyConstraint: {
                props: ['foo', 'bar'],
                match: 'every'
              }})
              expect(predicate({foo: 1, bar: 2})).to.be.ok()
              expect(predicate({foo: 1, bar: 2, baz: 3})).to.be.ok()
              expect(predicate({foo: 1})).not.to.be.ok()
              expect(predicate({})).not.to.be.ok()
              expect(predicate({foo: 1, baz: 3})).not.to.be.ok()
              expect(predicate({baz: 3})).not.to.be.ok()
            })
            it('outputs properly for match=some', function () {
              var {predicate} = new TypeParser({propertyConstraint: {
                props: ['foo', 'bar'],
                match: 'some'
              }})
              expect(predicate({foo: 1, bar: 2})).to.be.ok()
              expect(predicate({foo: 1, bar: 2, baz: 3})).to.be.ok()
              expect(predicate({foo: 1})).to.be.ok()
              expect(predicate({foo: 1, baz: 3})).to.be.ok()
              expect(predicate({})).not.to.be.ok()
              expect(predicate({baz: 3})).not.to.be.ok()
            })
            it('validates objects', function () {
              var instance = new TypeParser({propertyConstraint: {}})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('validates arrays', function () {
              var instance = new TypeParser({propertyConstraint: []})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('invalidates non-objects', function () {
              var instance = new TypeParser({propertyConstraint: 'Blue'})
              expect(instance.validate.bind(instance)).to.throwException(e => {
                expect(e).to.be.a(TypeError)
                expect(e).to.match(/propertyConstraint was string; expected array or object/)
              })
            })
          })
          describe('elementConstraint', function () {
            it('outputs properly', function () {
              Cite.parse.addFormat('@foo/bar', {parseType: {predicate: /foo/}})
              var {predicate} = new TypeParser({elementConstraint: '@foo/bar'})
              expect(predicate([])).to.be.ok()
              expect(predicate(['foo'])).to.be.ok()
              expect(predicate(['foo', 'foo'])).to.be.ok()

              expect(predicate(['bar'])).not.to.be.ok()
              expect(predicate(['foo', 'bar'])).not.to.be.ok()
              expect(predicate(['bar', 'bar'])).not.to.be.ok()
            })
            it('validates', function () {
              var instance = new TypeParser({elementConstraint: '@foo/bar'})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('invalidates non-strings', function () {
              var instance = new TypeParser({elementConstraint: 12})
              expect(instance.validate.bind(instance)).to.throwException(e => {
                expect(e).to.be.a(TypeError)
                expect(e).to.match(/elementConstraint was number; expected string/)
              })
            })
          })
          describe('extends', function () {
            it('outputs properly', function () {
              var {extends: extend} = new TypeParser({extends: '@foo/bar'})
              expect(extend).to.be('@foo/bar')
            })
            it('validates', function () {
              var instance = new TypeParser({extends: '@foo/bar'})
              expect(instance.validate.bind(instance)).to.not.throwException()
            })
            it('invalidates non-strings', function () {
              var instance = new TypeParser({extends: 2})
              expect(instance.validate.bind(instance)).to.throwException(e => {
                expect(e).to.be.a(TypeError)
                expect(e).to.match(/extends was number; expected string/)
              })
            })
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

        describe('async', function () {
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

        describe('class', function () {
          var {DataParser} = Cite.parse.util
          it('works', function () {
            var instance = new DataParser(() => {})
            var async = new DataParser(() => {}, {async: true})
            expect(typeof instance.parser).to.be('function')
            expect(typeof async.parser).to.be('function')
            expect(instance.async).not.to.be.ok()
            expect(async.async).to.be.ok()
          })
          it('validates', function () {
            var instance = new DataParser(() => {})
            expect(instance.validate.bind(instance)).not.to.throwException()
          })
          it('invalidates non-functions', function () {
            var instance = new DataParser(12)
            expect(instance.validate.bind(instance)).to.throwException(e => {
              expect(e).to.be.a(TypeError)
              expect(e).to.match(/parser was number; expected function/)
            })
          })
        })
      })

      describe('class', function () {
        var {FormatParser} = Cite.parse.util
        it('validates format', function () {
          var instance
          instance = new FormatParser('@foo/bar')
          expect(instance.validate.bind(instance)).not.to.throwException()
          instance = new FormatParser('@foo')
          expect(instance.validate.bind(instance)).not.to.throwException()
          instance = new FormatParser('@foo/baz+bar')
          expect(instance.validate.bind(instance)).not.to.throwException()
          instance = new FormatParser('foo')
          expect(instance.validate.bind(instance)).to.throwException()
          instance = new FormatParser('foo/bar')
          expect(instance.validate.bind(instance)).to.throwException()
          instance = new FormatParser('foo/baz+bar')
          expect(instance.validate.bind(instance)).to.throwException()
        })
        it('validates parsers', function () {
          var instance
          instance = new FormatParser('@foo/bar', {parseType: {dataType: 'String'}})
          expect(instance.validate.bind(instance)).not.to.throwException()
          instance = new FormatParser('@foo/bar', {parseType: {dataType: 12}})
          expect(instance.validate.bind(instance)).to.throwException()

          instance = new FormatParser('@foo/bar', {parseAsync: () => {}})
          expect(instance.validate.bind(instance)).not.to.throwException()
          instance = new FormatParser('@foo/bar', {parse: 12})
          expect(instance.validate.bind(instance)).to.throwException()

          instance = new FormatParser('@foo/bar', {parseAsync: () => {}})
          expect(instance.validate.bind(instance)).not.to.throwException()
          instance = new FormatParser('@foo/bar', {parseAsync: 12})
          expect(instance.validate.bind(instance)).to.throwException()
        })
      })
    })

    describe('dataType', function () {
      it('String', () => { expect(Cite.parse.util.dataTypeOf('foo')).to.be('String') })
      it('Array', () => { expect(Cite.parse.util.dataTypeOf([])).to.be('Array') })
      it('SimpleObject', () => { expect(Cite.parse.util.dataTypeOf({})).to.be('SimpleObject') })
      it('ComplexObject', () => { expect(Cite.parse.util.dataTypeOf(/foo/)).to.be('ComplexObject') })
      it('Primitive', () => { expect(Cite.parse.util.dataTypeOf(null)).to.be('Primitive') })

      describe('typeOf', function () {
        it('Undefined', () => { expect(Cite.parse.util.typeOf(undefined)).to.be('Undefined') })
        it('Null', () => { expect(Cite.parse.util.typeOf(null)).to.be('Null') })
        it('primitive literal', () => { expect(Cite.parse.util.typeOf('')).to.be('String') })
        it('Object', () => { expect(Cite.parse.util.typeOf({})).to.be('Object') })
      })
    })
  })
})
