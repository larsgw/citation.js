/**
 * @namespace parse
 * @memberof Cite
 *
 * @borrows Cite.plugins.input.chain as chain
 * @borrows Cite.plugins.input.chainAsync as chainAsync
 * @borrows Cite.plugins.input.chainLink as chainLink
 * @borrows Cite.plugins.input.chainLinkAsync as chainLinkAsync
 * @borrows Cite.plugins.input.data as data
 * @borrows Cite.plugins.input.dataAsync as dataAsync
 * @borrows Cite.plugins.input.type as type
 *
 * @borrows Cite.plugins.input.addTypeParser as addTypeParser
 * @borrows Cite.plugins.input.hasTypeParser as hasTypeParser
 * @borrows Cite.plugins.input.removeTypeParser as removeTypeParser
 * @borrows Cite.plugins.input.listTypeParser as listTypeParser
 * @borrows Cite.plugins.input.treeTypeParser as treeTypeParser
 * @borrows Cite.plugins.input.typeMatcher as typeMatcher
 * @borrows Cite.plugins.input.addDataParser as addDataParser
 * @borrows Cite.plugins.input.hasDataParser as hasDataParser
 * @borrows Cite.plugins.input.removeDataParser as removeDataParser
 * @borrows Cite.plugins.input.listDataParser as listDataParser
 */

/**
 * @namespace util
 * @memberof Cite.parse
 *
 * @borrows Cite.plugins.input.util.typeOf as typeOf
 * @borrows Cite.plugins.input.util.dataTypeOf as dataTypeOf
 * @borrows Cite.plugins.input.util.applyGraph as applyGraph
 * @borrows Cite.plugins.input.util.removeGraph as removeGraph
 * @borrows Cite.plugins.input.util.TypeParser as TypeParser
 * @borrows Cite.plugins.input.util.DataParser as DataParser
 * @borrows Cite.plugins.input.util.FormatParser as FormatParser
 */

import './modules/'

// BEGIN compat
import {chain, chainLink, chainAsync, chainLinkAsync} from './interface/chain'
import {data, dataAsync} from './interface/data'
import {type} from './interface/type'

import {parsers as bibjsonParsers} from './modules/bibjson/'
import {parsers as bibtexParsers} from './modules/bibtex/'
import {parsers as doiParsers} from './modules/doi/'
import {parsers as wikidataParsers} from './modules/wikidata/'

/**
 * @namespace wikidata
 * @memberof Cite.parse
 * @deprecated now part of the {@link module:input/wikidata} module
 *
 * @borrows module:input/wikidata~parseWikidata as list
 * @borrows module:input/wikidata~parseWikidataJSON as json
 * @borrows module:input/wikidata~parseWikidataProp as prop
 * @borrows module:input/wikidata~parseWikidataType as type
 */
export const wikidata = {
  list: wikidataParsers.list.parse,
  json: wikidataParsers.json.parse,
  prop: wikidataParsers.prop.parse,
  type: wikidataParsers.type.parse,

  /**
   * @namespace async
   * @memberof Cite.parse.wikidata
   * @deprecated now part of the {@link module:input/wikidata} module
   *
   * @borrows module:input/wikidata~parseWikidataJSONAsync as json
   * @borrows module:input/wikidata~parseWikidataPropAsync as prop
   */
  async: {json: wikidataParsers.json.parseAsync, prop: wikidataParsers.prop.parseAsync}
}

/**
 * @namespace bibtex
 * @memberof Cite.parse
 * @deprecated now part of the {@link module:input/bibtex} module
 *
 * @borrows module:input/bibtex~parseBibTeXJSON as json
 * @borrows module:input/bibtex~parseBibTeX as text
 * @borrows module:input/bibtex~parseBibTeXProp as prop
 * @borrows module:input/bibtex~parseBibTeXType as type
 */
export const bibtex = {
  json: bibtexParsers.json.parse,
  text: bibtexParsers.text.parse,
  prop: bibtexParsers.prop.parse,
  type: bibtexParsers.type.parse
}

/**
 * @namespace bibtxt
 * @memberof Cite.parse
 * @deprecated now part of the {@link module:input/bibtex} module
 *
 * @borrows module:input/bibtex~parseBibTxt as text
 * @borrows module:input/bibtex~parseBibTxtEntry as textEntry
 */
export const bibtxt = {
  text: bibtexParsers.bibtxt.text,
  textEntry: bibtexParsers.bibtxt.textEntry
}

/**
 * @memberof Cite.parse
 * @borrows module:input/bibjson~parseContentMine as bibjson
 * @deprecated now part of the {@link module:input/bibjson} module
 */
export const bibjson = bibjsonParsers.json.parse

/**
 * @namespace doi
 * @memberof Cite.parse
 * @deprecated now part of the {@link module:input/doi} module
 *
 * @borrows module:input/doi~parseDoi as id
 * @borrows module:input/doi~parseDoiApi as api
 */
export const doi = {
  id: doiParsers.id.parse,
  api: doiParsers.api.parse,

  /**
   * @namespace async
   * @memberof Cite.parse.doi
   * @deprecated now part of the {@link module:input/doi} module
   *
   * @borrows module:input/doi~parseDoiApiAsync as api
   */
  async: {api: doiParsers.api.parseAsync}
}

/**
 * @borrows module:input/other~parseJSON as Cite.parse.json
 * @deprecated now part of the {@link module:input/other} module
 */
export {parse as json} from './modules/other/json'

/**
 * @namespace input
 * @memberof Cite.parse
 * @deprecated use toplevel methods
 *
 * @borrows Cite.plugins.input.chain as chain
 * @borrows Cite.plugins.input.chainAsync as chainAsync
 * @borrows Cite.plugins.input.chainLink as chainLink
 * @borrows Cite.plugins.input.chainLinkAsync as chainLinkAsync
 * @borrows Cite.plugins.input.data as data
 * @borrows Cite.plugins.input.dataAsync as dataAsync
 * @borrows Cite.plugins.input.type as type
 */
export const input = {
  chain,
  chainAsync,
  chainLink,
  chainLinkAsync,
  data,
  dataAsync,
  type,

  /**
   * @namespace async
   * @memberof Cite.parse.input
   * @deprecated use toplevel methods
   *
   * @borrows Cite.plugins.input.chainAsync as chainAsync
   * @borrows Cite.plugins.input.chainLinkAsync as chainLinkAsync
   * @borrows Cite.plugins.input.dataAsync as dataAsync
   */
  async: {
    chain: chainAsync,
    chainLink: chainLinkAsync,
    data: dataAsync
  }
}
// END compat

export {default as date} from './date'
export {default as name} from './name'
export {default as csl} from './csl'
export * from './interface/'
