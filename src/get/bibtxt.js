import getBibTeXJSON from './bibtex/json'
import { htmlDict, textDict } from './dict'

/**
 * Get a Bib.TXT (HTML) string from CSL
 *
 * @access protected
 * @method getBibTxt
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 *
 * @return {String} BibTeX (HTML) string
 */
const getBibTxt = function (src, html) {
  const dict = html ? htmlDict : textDict

  const entries = src.map(entry => {
    const bib = getBibTeXJSON(entry)
    const properties = Object.keys(bib.properties).map(prop =>
      `${dict.li_start}${prop}: ${bib.properties[prop]}${dict.li_end}`
    ).join('')

    return `${dict.en_start}[${bib.label}]${dict.ul_start}${dict.li_start}type: ${bib.type}${dict.li_end}${properties}${dict.ul_end}${dict.en_end}`
  }).join('\n')

  return `${dict.wr_start}${entries}${dict.wr_end}`
}

export default getBibTxt
