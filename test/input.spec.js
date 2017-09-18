/* global describe, context, it */

import expect from 'expect.js'
import Cite from './citation'
import input from './input/parse'
import output from './output/parse'
input.wd.simple = require('./Q21972834.json')
input.wd.author = require('./Q27795847.json')

const testCaseGenerator = (input, type, output, {callback, link = false} = {}) => () => {
  let test = link
    ? Cite.parse.input.chainLink(input)
    : Cite.parse.input.chain(input, {generateGraph: false})
  test = typeof callback === 'function'
    ? callback(test)
    : test

  it('handles input type', () => {
    expect(Cite.parse.input.type(input)).to.be(type)
  })

  it('parses input correctly', () => {
    expect(test).to.eql(output)
  })
}

const wikidataTestCaseOptions = {
  callback: ([data]) => data.replace(/[&?]origin=\*/, ''),
  link: true
}
const doiLinkTestCaseOptions = {link: true}
const doiTestCaseOptions = {link: true, callback: ({title}) => title}

describe('input', () => {
  describe('Wikidata ID', testCaseGenerator(
    input.wd.id, '@wikidata/id', output.wd.api[0], wikidataTestCaseOptions))

  describe('Wikidata URL', testCaseGenerator(
    input.wd.url, '@wikidata/url', output.wd.api[0], wikidataTestCaseOptions))

  describe('Wikidata ID list', () => {
    context('separated by spaces', testCaseGenerator(
      input.wd.list.space, '@wikidata/list+text', output.wd.api[1], wikidataTestCaseOptions))

    context('separated by newlines', testCaseGenerator(
      input.wd.list.newline, '@wikidata/list+text', output.wd.api[1], wikidataTestCaseOptions))

    context('separated by commas', testCaseGenerator(
      input.wd.list.comma, '@wikidata/list+text', output.wd.api[1], wikidataTestCaseOptions))
  })

  describe('Wikidata JSON', () => {
    testCaseGenerator(input.wd.simple, '@wikidata/object', output.wd.simple)()

    context('with linked authors',
      testCaseGenerator(input.wd.author, '@wikidata/object', output.wd.author))
  })

  describe('DOI ID', testCaseGenerator(input.doi.id, '@doi/id', output.doi.api[0], doiLinkTestCaseOptions))
  describe('DOI URL', testCaseGenerator(input.doi.url, '@doi/api', output.doi.simple.title, doiTestCaseOptions))

  describe('DOI ID list', () => {
    context('separated by spaces', testCaseGenerator(
      input.doi.list.space, '@doi/list+text', output.doi.api[1], doiLinkTestCaseOptions))

    context('separated by newlines', testCaseGenerator(
      input.doi.list.newline, '@doi/list+text', output.doi.api[1], doiLinkTestCaseOptions))
  })

  describe('BibTeX string', () => {
    testCaseGenerator(input.bibtex.simple, '@bibtex/text', output.bibtex.simple)()

    context('with whitespace and unknown fields',
      testCaseGenerator(input.bibtex.whitespace, '@bibtex/text', output.bibtex.whitespace))

    context('with literals', testCaseGenerator(input.bibtex.literals, '@bibtex/text', output.bibtex.literals))
    context('with year and month without date', testCaseGenerator(input.bibtex.yearMonthNeeded, '@bibtex/text', output.bibtex.yearMonthNeeded))
    context('with year and month with date', testCaseGenerator(input.bibtex.yearMonth, '@bibtex/text', output.bibtex.yearMonth))
  })

  describe('BibTeX JSON', testCaseGenerator(
    input.bibtex.json, '@bibtex/object', output.bibtex.simple))

  describe('Bib.TXT string', () => {
    testCaseGenerator(input.bibtxt.simple, '@bibtxt/text', [output.bibtxt])()

    context('with multiple entries',
      testCaseGenerator(input.bibtxt.multiple, '@bibtxt/text', [output.bibtxt, output.bibtex.simple[0]]))

    context('with whitespace',
      testCaseGenerator(input.bibtxt.whitespace, '@bibtxt/text', [output.bibtxt]))
  })

  describe('CSL-JSON', () => {
    testCaseGenerator(input.csl.simple, '@csl/object', [input.csl.simple])()

    context('as JSON string', testCaseGenerator(JSON.stringify(input.csl.simple), '@else/json', [input.csl.simple]))
    context('as JS Object string', testCaseGenerator(input.csl.string, '@else/json', [input.csl.simple]))
    context('with a syntax error', testCaseGenerator('{"hi"}', '@else/json', []))
  })

  describe('ContentMine JSON',
    testCaseGenerator(input.bibjson.simple, '@contentmine/object', output.bibjson.simple))

  describe('Array', () => {
    const objs = [{id: 'a'}, {id: 'b'}]

    testCaseGenerator(objs, '@csl/list+object', objs)()
    it('duplicates objects', () => {
      expect(Cite(objs).data).not.to.be(objs)
    })

    describe('nested', () => {
      const data = [[objs[0]], objs[1]]

      testCaseGenerator(data, '@else/list+object', objs)()
      it('duplicates objects', () => {
        const test = Cite(data).data

        expect(test[0]).not.to.be(objs[0])
        expect(test[1]).not.to.be(objs[1])
      })
    })
  })

  describe('Empty', () => {
    describe('string', () => {
      describe('empty', testCaseGenerator('', '@empty/text', []))
      describe('whitespace', testCaseGenerator('   \t\n \r  ', '@empty/whitespace+text', []))
    })

    describe('null', testCaseGenerator(null, '@empty', []))
    describe('undefined', testCaseGenerator(undefined, '@empty', []))
  })
})
