/* eslint-env mocha */

import expect from 'expect.js'
import Cite from './citation'
import input from './input/parse'
import output from './output/parse'
input.wd.simple = require('./Q21972834.json')
input.wd.author = require('./Q27795847.json')

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
    'with rich text': [input.bibtex.rich, output.bibtex.rich],
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
  '@bibjson/quickscrape+record+object': [input.bibjson.quickscrape, output.bibjson.quickscrape],
  '@bibjson/record+object': [input.bibjson.simple, output.bibjson.simple],

  // @else
  '@else/json': {
    'as JSON string': [JSON.stringify(input.csl.simple), [input.csl.simple]],
    'as JS Object string': [input.csl.string, [input.csl.simple]],
    'with a syntax error': ['{"hi"}', []]
  },

  // @empty
  '@empty/text': ['', []],
  '@empty/whitespace+text': ['   \t\n \r  ', []],
  '@empty': {
    '(null)': [null, []],
    '(undefined)': [undefined, []]
  },

  // internal
  '@invalid': ['anything not covered by the parsers above', []],
  '@csl/object': {
    'with no properties': [{}, [{}]],
    'with nonsense properties': [{a: 1}, [{a: 1}]],
    'with proper properties': [{title: 'test'}, [{title: 'test'}]]
  },
  '@csl/list+object': {
    'without elements': [[], [], {link: true}],
    'with elements': [[{}], [{}], {link: true}]
  },
  '@else/list+object': [
    [
      [
        {i: 1}
      ],
      [
        {i: 2},
        [
          {i: 3}
        ]
      ],
      {i: 4}
    ],
    [
      {i: 1},
      {i: 2},
      {i: 3},
      {i: 4}
    ]
  ]
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
    const {chain, chainAsync, chainLink, chainLinkAsync} = Cite.parse
    describe('chain', function () {
      it('parses', function () {
        expect(chain({}, {generateGraph: false})).to.eql([{}])
      })
      it('parses until success', function () {
        // TODO non-builtin type
        expect(chain('{}', {generateGraph: false})).to.eql([{}])
      })
      it('copies', function () {
        const object = {}
        expect(chain(object)[0]).not.to.be(object)
      })
      describe('options', function () {
        it('generateGraph', function () {
          expect(chain({}, {generateGraph: true})[0]).to.have.property('_graph')
          expect(chain({}, {generateGraph: false})[0]).not.to.have.property('_graph')
        })
        it('maxChainLength', function () {
          expect(chain({}, {maxChainLength: 1, generateGraph: false})).to.eql([{}])
          expect(chain({}, {maxChainLength: 0, generateGraph: false})).to.eql([])
        })
        it('forceType', function () {
          expect(chain({}, {generateGraph: false})).to.eql([{}])
          expect(chain({}, {forceType: '@foo/bar', generateGraph: false})).to.eql([])
        })
      })
    })
    describe('chainLink', function () {
      it('parses', function () {
        expect(chainLink({})).to.eql([{}])
      })
      it('parses only once', function () {
        // TODO non-builtin type
        expect(chainLink('{}')).to.eql({})
      })
      it('copies', function () {
        const object = {}
        expect(chainLink(object)[0]).not.to.be(object)
      })
    })
    describe('chainAsync', function () {
      it('parses', async function () {
        expect(await chainAsync({}, {generateGraph: false})).to.eql([{}])
      })
      it('parses until success', async function () {
        // TODO non-builtin type
        expect(await chainAsync('{}', {generateGraph: false})).to.eql([{}])
      })
      it('copies', async function () {
        const object = {}
        expect((await chainAsync(object))[0]).not.to.be(object)
      })
      describe('options', function () {
        it('generateGraph', async function () {
          expect((await chainAsync({}, {generateGraph: true}))[0]).to.have.property('_graph')
          expect((await chainAsync({}, {generateGraph: false}))[0]).not.to.have.property('_graph')
        })
        it('maxChainLength', async function () {
          expect(await chainAsync({}, {maxChainLength: 1, generateGraph: false})).to.eql([{}])
          expect(await chainAsync({}, {maxChainLength: 0, generateGraph: false})).to.eql([])
        })
        it('forceType', async function () {
          expect(await chainAsync({}, {generateGraph: false})).to.eql([{}])
          expect(await chainAsync({}, {forceType: '@foo/bar', generateGraph: false})).to.eql([])
        })
      })
    })
    describe('chainLinkAsync', function () {
      it('parses', async function () {
        expect(await chainLinkAsync({})).to.eql([{}])
      })
      it('parses only once', async function () {
        // TODO non-builtin type
        expect(await chainLinkAsync('{}')).to.eql({})
      })
      it('copies', async function () {
        const object = {}
        expect((await chainLinkAsync(object))[0]).not.to.be(object)
      })
    })
  })
})
