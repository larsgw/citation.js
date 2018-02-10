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
