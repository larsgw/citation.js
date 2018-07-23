/**
 * @module output/csl
 */

import prepareEngine from './engines'
import {getPrefixedEntry} from './attr.js'

/**
 * Get a rendered affix
 *
 * @access private
 *
 * @param {CSL} source - source element
 * @param {String|Cite~wrapper} affix
 *
 * @return {String} Rendered affixs
 */
const getAffix = (source, affix) => typeof affix === 'function' ? affix(source) : affix || ''

/**
 * @access protected
 * @method bibliography
 *
 * @param {Array<CSL>} data
 * @param {Object} [options={}]
 * @param {String} [options.template='apa']
 * @param {String} [options.lang='en-US']
 * @param {String} [options.format='text']
 *
 * @return {String} output
 */
export default function bibliography (data, options = {}) {
  const {template = 'apa', lang = 'en-US', format = 'text'} = options
  const citeproc = prepareEngine(data, template, lang, format)
  const sortedIds = citeproc.updateItems(data.map(entry => entry.id))

  if (options.append || options.prepend) {
    let {append, prepend} = options
    let items = data.reduce((items, entry) => { items[entry.id] = entry; return items }, {})

    citeproc.sys.wrapBibliographyEntry = function (id) {
      let entry = items[id]
      return [getAffix(entry, prepend), getAffix(entry, append)]
    }
  } else {
    citeproc.sys.wrapBibliographyEntry = () => ['', '']
  }

  const bibliography = citeproc.makeBibliography()
  const [{bibstart, bibend}, bibBody] = bibliography
  const entries = bibBody.map((element, index) => getPrefixedEntry(element, sortedIds[index]))

  return bibstart + entries.join('') + bibend
}
