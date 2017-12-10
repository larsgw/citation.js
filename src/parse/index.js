/**
 * @namespace parse
 * @memberof Cite
 */

import * as input from './input/'
import date from './date'
import name from './name'

import './modules/'

// BEGIN compat
import {parsers as bibjsonParsers} from './modules/bibjson/'
import {parsers as bibtexParsers} from './modules/bibtex/'
import {parsers as doiParsers} from './modules/doi/'
import {parsers as wikidataParsers} from './modules/wikidata/'

export const wikidata = {
  list: wikidataParsers.list.parse,
  json: wikidataParsers.json.parse,
  prop: wikidataParsers.prop.parse,
  type: wikidataParsers.type.parse,
  async: {json: wikidataParsers.json.parseAsync, prop: wikidataParsers.prop.parseAsync}
}
export const bibtex = {
  json: bibtexParsers.json.parse,
  text: bibtexParsers.text.parse,
  prop: bibtexParsers.prop.parse,
  type: bibtexParsers.type.parse
}
export const bibtxt = {
  text: bibtexParsers.bibtxt.text,
  textEntry: bibtexParsers.bibtxt.textEntry
}
export const bibjson = bibjsonParsers.json.parse
export const doi = {
  id: doiParsers.id.parse,
  api: doiParsers.api.parse,
  async: {api: doiParsers.api.parseAsync}
}
export {parse as json} from './modules/other/json'
// END compat

export {date, name, input}
export {default as csl} from './csl'
export * from './registrar/'
