/**
 * @module output/bibtex
 */

import getBibTeXJSON from './json'
import {get as getDict} from '../../dict'

/**
 * Get a Bib.TXT string from CSL
 *
 * @access protected
 * @method getBibtxt
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} Bib.TXT string
 */
const getBibtxt = function (src, dict) {
  const entries = src.map(entry => {
    const bib = getBibTeXJSON(entry)
    bib.properties.type = bib.type
    const properties = Object.entries(bib.properties).map(([prop, value]) =>
      dict.listItem.join(`${prop}: ${value}`)
    ).join('')

    return dict.entry.join(`[${bib.label}]${dict.list.join(properties)}`)
  }).join('\n')

  return dict.bibliographyContainer.join(entries)
}

/**
 * Get a BibTeX (HTML) string from CSL
 *
 * @access protected
 * @method getBibtxtWrapper
 * @deprecated use the generalised method: {@link module:output/bibtex~getBibtxt}
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 *
 * @return {String} Bib.TXT (HTML) string
 */
const getBibtxtWrapper = function (src, html) {
  const dict = getDict(html ? 'html' : 'text')
  return getBibtxt(src, dict)
}

export {getBibtxt}
export default getBibtxtWrapper
