/**
 * @module output/bibtex
 */

import getBibTeXJSON from './json'
import {get as getDict} from '../../dict'

/**
 * Mapping of BibTeX syntax chars to BibTeX Escaped Chars.
 *
 * From [Zotero's alwaysMap object](https://github.com/zotero/translators/blob/master/BibTeX.js#L225)
 * [REPO](https://github.com/zotero/translators)
 *
 * Accesed 11/20/2016
 *
 * @access private
 * @constant syntaxTokens
 * @default
 */
const syntaxTokens = {
  '|': '{\\textbar}',
  '<': '{\\textless}',
  '>': '{\\textgreater}',
  '~': '{\\textasciitilde}',
  '^': '{\\textasciicircum}',
  '\\': '{\\textbackslash}',
  // See http://tex.stackexchange.com/questions/230750/open-brace-in-bibtex-fields/230754
  '{': '\\{\\vphantom{\\}}',
  '}': '\\vphantom{\\{}\\}'
}

const caseSensitive = ['title']
const bracketMappings = {
  '': '',
  '{': '}',
  '{{': '}}'
}

const wrapInBrackets = (prop, value) => {
  const delStart = !isNaN(+value) ? '' : caseSensitive.includes(prop) ? '{{' : '{'
  const delEnd = bracketMappings[delStart]
  return delStart + value + delEnd
}

/**
 * Get a BibTeX (HTML) string from CSL
 *
 * @access protected
 * @method getBibtex
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} BibTeX string
 */
const getBibtex = function (src, dict) {
  const entries = src.map(sourceEntry => {
    const entry = getBibTeXJSON(sourceEntry)
    const properties = Object.entries(entry.properties).map(([prop, value]) => {
      value = value.replace(/[|<>~^\\{}]/g, match => syntaxTokens[match])
      return dict.listItem.join(`${prop}=${wrapInBrackets(prop, value)},`)
    }).join('')

    return dict.entry.join(`@${entry.type}{${entry.label},${dict.list.join(properties)}}`)
  }).join('')

  return dict.bibliographyContainer.join(entries)
}

/**
 * Get a BibTeX (HTML) string from CSL
 *
 * @access protected
 * @method getBibTeXWrapper
 * @deprecated use the generalised method: {@link module:output/bibtex~getBibtex}
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 *
 * @return {String} BibTeX (HTML) string
 */
const getBibTeXWrapper = function (src, html) {
  const dict = getDict(html ? 'html' : 'text')
  return getBibtex(src, dict)
}

export {getBibtex}
export default getBibTeXWrapper
