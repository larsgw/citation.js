import striptags from 'striptags'

import { getPrefixedEntry, getWrappedEntry } from '../util/attr.js'

import getBibTeXJSON from '../get/bibtex/json'
import getBibTeX from '../get/bibtex/text'
import getBibTxt from '../get/bibtxt'
import getJSON from '../get/json'

import parseCsl from '../parse/csl'

import fetchCSLEngine from '../CSL/engines'
import fetchCSLStyle from '../CSL/styles'
import fetchCSLLocale from '../CSL/locales'
import fetchCSLItemCallback from '../CSL/items'

/**
 * Get a list of the data entry IDs, in the order of that list
 *
 * @method getIds
 * @memberof Cite
 * @this Cite
 *
 * @return {Array<String>} List of IDs
 */
const getIds = function () {
  return this.data.map(entry => entry.id)
}

/**
 * Get formatted data from your object. For more info, see [Output](../#cite.out).
 *
 * @method get
 * @memberof Cite
 * @this Cite
 *
 * @param {Object} [options={}] - [Output options](../#cite.out.options)
 *
 * @return {String|Array<Object>} The formatted data
 */
const get = function (options = {}) {
  const {format, type, style, lang, append, prepend} = Object.assign({}, this.defaultOptions, this._options.output, options)
  const [, styleType, styleFormat] = style.match(/^([^-]+)(?:-(.+))?$/)

  const data = parseCsl(this.data)
  let result

  switch ([type, styleType].join()) {
    case 'html,citation':
      const useLang = fetchCSLLocale(lang) ? lang : 'en-US'
      const useTemplate = fetchCSLStyle(styleFormat)
      const cbItem = fetchCSLItemCallback(data)

      const citeproc = fetchCSLEngine(styleFormat, useLang, useTemplate, cbItem, fetchCSLLocale)
      const sortedIds = citeproc.updateItems(this.getIds())

      const [{bibstart: bibStart, bibend: bibEnd}, bibBody] = citeproc.makeBibliography()
      let entries = bibBody.map((element, index) => getPrefixedEntry(element, sortedIds[index]))

      if (append || prepend) {
        const sortedItems = sortedIds.map(itemId => this.data.find(({id}) => id === itemId))
        entries = entries.map((element, index) => getWrappedEntry(element, sortedItems[index], {append, prepend}))
      }

      result = `${bibStart}${entries.join('<br />')}${bibEnd}`
      break

    case 'html,csl':
      result = getJSON(data)
      break

    case 'html,bibtex':
      result = getBibTeX(data, true)
      break

    case 'string,bibtex':
      result = getBibTeX(data, false)
      break

    case 'html,bibtxt':
      result = getBibTxt(data, true)
      break

    case 'string,bibtxt':
      result = getBibTxt(data, false)
      break

    case 'string,citation':
      result = striptags(this.get(Object.assign({}, options, {type: 'html'})))
      break

    case 'string,csl':
      result = JSON.stringify(data)
      break

    case 'json,csl':
      result = JSON.stringify(data)
      break

    case 'json,bibtex':
    case 'json,bibtxt':
      result = JSON.stringify(data.map(getBibTeXJSON))
      break

    case 'json,citation':
      console.error('[get]', `Combination type/style of json/citation-* is not valid: ${type}/${style}`)
      break

    default:
      console.error('[get]', 'Invalid options')
      break
  }

  if (format === 'real') {
    if (type === 'json') {
      result = JSON.parse(result)
    } else if (type === 'html' && typeof document !== 'undefined' && document.createElement) {
      const tmp = document.createElement('div')
      tmp.innerHTML = result
      result = tmp.firstChild
    }
  }

  return result
}

export { getIds, get }
