/**
 * @module output/csl
 */

import prepareEngine from './engines'

import {getPrefixedEntry} from './attr.js'
import {getWrappedEntry} from './affix'

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

  const bibliography = citeproc.makeBibliography()
  const [{bibstart, bibend}, bibBody] = bibliography
  const entries = bibBody.map((element, index) => getPrefixedEntry(element, sortedIds[index]))

  if (options.append || options.prepend) {
    const {append, prepend} = options
    const items = data.reduce((items, entry) => { items[entry.id] = entry; return items }, {})
    const sortedItems = sortedIds.map(id => items[id])

    entries.forEach((entry, index) => {
      entries[index] = getWrappedEntry(entry, sortedItems[index], {append, prepend})
    })
  }

  return bibstart + entries.join('') + bibend
}
