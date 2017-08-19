import getBibTeXJSON from './json'
import { htmlDict, textDict } from '../dict'

/**
 * Mapping of BibTeX syntax chars to BibTeX Escaped Chars.
 *
 * From [Zotero's alwaysMap object](https://github.com/zotero/translators/blob/master/BibTeX.js#L225)
 * [REPO](https://github.com/zotero/translators)
 *
 * Accesed 11/20/2016
 *
 * @access private
 * @constant varBibTeXSyntaxTokens
 * @default
 */
const varBibTeXSyntaxTokens = {
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

/**
 * Get a BibTeX (HTML) string from CSL
 *
 * @access protected
 * @method getBibTeX
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 *
 * @return {String} BibTeX (HTML) string
 */
const getBibTeX = function (src, html) {
  const dict = html ? htmlDict : textDict
  const caseSensitive = ['title']

  const entries = src.map((entry) => {
    const bib = getBibTeXJSON(entry)
    const properties = Object.keys(bib.properties).map((prop) => {
      const value = bib.properties[prop].replace(/[|<>~^\\{}]/g, (match) => varBibTeXSyntaxTokens[match])
      const delStart = value === parseInt(value).toString() ? '' : caseSensitive.includes(prop) ? '{{' : '{'
      const delEnd = delStart.replace(/{/g, '}').split('').reverse().join('')

      return `${dict.li_start}${prop}=${delStart}${value}${delEnd},${dict.li_end}`
    }).join('')

    return `${dict.en_start}@${bib.type}{${bib.label},${dict.ul_start}${properties}${dict.ul_end}}${dict.en_end}`
  }).join('')

  return `${dict.wr_start}${entries}${dict.wr_end}`
}

export default getBibTeX
