import varRegex from '../regex'

import fetchFile from '../../util/fetchFile'
import parseInput from './chain'
import parseWikidata from '../wikidata/list'
import parseWikidataJSON from '../wikidata/json'
import parseDoi from '../doi/id'
import parseDoiApi from '../doi/api'
import parseContentMine from '../bibjson/index'
import parseBibTeX from '../bibtex/text'
import { text as parseBibTxt } from '../bibtxt'
import parseBibTeXJSON from '../bibtex/json'
import parseJSON from '../json'

/**
 * Standardise input (internal use)
 *
 * @access protected
 * @method parseInputData
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {String} type - The input type
 *
 * @return {Array<CSL>} The parsed input
 */
const parseInputData = function (input, type) {
  switch (type) {
    case 'string/wikidata':
      return parseWikidata(input.match(varRegex.wikidata[0])[1])

    case 'list/wikidata':
      return parseWikidata(input.match(varRegex.wikidata[1])[1])

    case 'api/wikidata':
      return fetchFile(input)

    case 'url/wikidata':
      return parseWikidata(input.match(varRegex.wikidata[3])[1])

    case 'array/wikidata':
      return parseWikidata(input.join(','))

    case 'api/doi':
      return parseDoiApi(input)

    case 'string/doi':
      return parseDoi(input)

    case 'list/doi':
      return parseDoi(input)

    case 'array/doi':
      return parseDoi(input.join('\n'))

    case 'url/else':
      return fetchFile(input)

    case 'jquery/else':
      return input.val() || input.text() || input.html()

    case 'html/else':
      return input.value || input.textContent

    case 'string/json':
      return parseJSON(input)

    case 'string/bibtex':
      return parseBibTeX(input)

    case 'string/bibtxt':
      return parseBibTxt(input)

    case 'object/bibtex':
      return parseBibTeXJSON(input)

    case 'object/wikidata':
      return parseWikidataJSON(input)

    case 'object/contentmine':
      return parseContentMine(input)

    case 'array/else':
      return [].concat(...input.map(value => parseInput(value)))

    case 'object/csl':
      return [input]

    case 'array/csl':
      return input

    case 'string/empty':
    case 'string/whitespace':
    case 'empty':
    case 'invalid':
    default:
      return []
  }
}

export default parseInputData
