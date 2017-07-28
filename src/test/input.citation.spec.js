/* global require, module, describe, it, expect */

const Cite = require('./cite')

const test = require('./input.json')
test.input.wd.simple = require('./Q21972834.json')
test.input.wd.author = require('./Q27795847.json')

const testCaseGenerator = function (input, type, output, {
  exact = false,
  callback = v => v,
  link = false
} = {}) {
  return function () {
    const test = link ? Cite.parse.input.chainLink(input) : (new Cite(input)).data

    it('handles input type', function () {
      expect(Cite.parse.input.type(input)).toBe(type)
    })

    it('parses input correctly', function () {
      expect(callback(test))[exact ? 'toBe' : 'toEqual'](output)
    })
  }
}

const wikidataTestCaseOptions = {
  exact: true,
  callback: ([data]) => data.replace(/[&?]origin=\*/, ''),
  link: true
}

const doiLinkTestCaseOptions = {
  link: true
}

const doiTestCaseOptions = {
  link: true,
  callback: ({title}) => title
}

module.exports = {
  async: function () {
    describe('with callback', function () {
      it('works', function () {
        return new Promise(resolve => {
          Cite.async(test.input.wd.url, data => {
            expect(data instanceof Cite).toBe(true)
            expect(data.data[0].wikiId).toBe(test.output.wd.id)
            resolve()
          })
        })
      })

      it('works with options', function () {
        return new Promise(resolve => {
          Cite.async([], {}, data => {
            expect(data instanceof Cite).toBe(true)
            expect(data.data.length).toBe(0)
            resolve()
          })
        })
      })
    })

    describe('with promise', function () {
      it('works', async function () {
        const data = await Cite.async(test.input.wd.url)
        expect(data instanceof Cite).toBe(true)
        expect(data.data[0].wikiId).toBe(test.output.wd.id)
      })

      it('works with options', async function () {
        const data = await Cite.async([], {})
        expect(data instanceof Cite).toBe(true)
        expect(data.data.length).toBe(0)
      })
    })
  },
  input: function () {
    describe('Wikidata ID', testCaseGenerator(
      test.input.wd.id, 'string/wikidata', test.output.wd.api[0], wikidataTestCaseOptions))

    describe('Wikidata URL', testCaseGenerator(
      test.input.wd.url, 'url/wikidata', test.output.wd.api[0], wikidataTestCaseOptions))

    describe('Wikidata ID list', function () {
      describe('separated by spaces', testCaseGenerator(
        test.input.wd.list.space, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions))

      describe('separated by newlines', testCaseGenerator(
        test.input.wd.list.newline, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions))

      describe('separated by commas', testCaseGenerator(
        test.input.wd.list.comma, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions))
    })

    describe('Wikidata JSON', function () {
      testCaseGenerator(test.input.wd.simple, 'object/wikidata', test.output.wd.simple)()

      describe('with linked authors',
        testCaseGenerator(test.input.wd.author, 'object/wikidata', test.output.wd.author))
    })

    describe('DOI ID', testCaseGenerator(
      test.input.doi.id, 'string/doi', test.output.doi.api[0], doiLinkTestCaseOptions))

    describe('DOI URL', testCaseGenerator(
      test.input.doi.url, 'api/doi', test.output.doi.simple.title, doiTestCaseOptions))

    describe('DOI ID list', function () {
      describe('separated by spaces', testCaseGenerator(
        test.input.doi.list.space, 'list/doi', test.output.doi.api[1], doiLinkTestCaseOptions))

      describe('separated by newlines', testCaseGenerator(
        test.input.doi.list.newline, 'list/doi', test.output.doi.api[1], doiLinkTestCaseOptions))
    })

    describe('BibTeX string', function () {
      testCaseGenerator(test.input.bibtex.simple, 'string/bibtex', test.output.bibtex.simple)()

      describe('with whitespace and unknown fields',
        testCaseGenerator(test.input.bibtex.whitespace, 'string/bibtex', test.output.bibtex.whitespace))
    })

    describe('BibTeX JSON', testCaseGenerator(
      test.input.bibtex.json, 'object/bibtex', test.output.bibtex.simple))

    describe('Bib.TXT string', function () {
      testCaseGenerator(test.input.bibtxt.simple, 'string/bibtxt', [test.output.bibtxt])()

      describe('with multiple entries',
        testCaseGenerator(test.input.bibtxt.multiple, 'string/bibtxt', [test.output.bibtxt, test.output.bibtex.simple[0]]))

      describe('with whitespace',
        testCaseGenerator(test.input.bibtxt.whitespace, 'string/bibtxt', [test.output.bibtxt]))
    })

    describe('CSL-JSON', testCaseGenerator(test.input.csl[0], 'object/csl', test.input.csl))
    describe('ContentMine JSON',
      testCaseGenerator(test.input.bibjson.simple, 'object/contentmine', test.output.bibjson.simple))

    describe('Array', function () {
      const objs = [{id: 'a'}, {id: 'b'}]

      testCaseGenerator(objs, 'array/csl', objs)()
      it('duplicates objects', function () {
        expect((new Cite(objs)).data).not.toBe(objs)
      })

      describe('nested', function () {
        const data = [[objs[0]], objs[1]]

        testCaseGenerator(data, 'array/else', objs)()
        it('duplicates objects', function () {
          const test = new Cite(data).data

          expect(test[0]).not.toBe(objs[0])
          expect(test[1]).not.toBe(objs[1])
        })
      })
    })

    describe('Empty', function () {
      describe('string', function () {
        describe('empty', testCaseGenerator('', 'string/empty', []))
        describe('whitespace', testCaseGenerator('   \t\n \r  ', 'string/whitespace', []))
      })

      describe('null', testCaseGenerator(null, 'empty', []))
      describe('undefined', testCaseGenerator(undefined, 'empty', []))
    })
  }
}
