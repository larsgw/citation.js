import prepareEngine from './engines'

import {getPrefixedEntry} from './attr.js'
import {getWrappedEntry} from './affix'

export default function bibliography (data, options) {
  const {template, lang, format} = options
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
