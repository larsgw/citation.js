import striptags from 'striptags'

import { getPrefixedEntry } from '../util/attr.js'
import deepCopy from '../util/deepCopy'

import getBibTeXJSON from '../get/bibtex/json'
import getBibTeX from '../get/bibtex/text'
import getBibTxt from '../get/bibtxt'
import getJSON from '../get/json'

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
 * @return {String[]} List of IDs
 */
const getIds = function () {
  return this.data.map(entry => entry.id)
}

/**
 * Get formatted data from your object. For more info, see [Output](../#output).
 *
 * @method get
 * @memberof Cite
 * @this Cite
 *
 * @param {Object} options - The options for the output. See [input options](../#citation.cite.in.options)
 * @param {String} [options.locale] - Custom CSL locale for citeproc
 * @param {String} [options.template] - Custom CSL style template for citeproc
 *
 * @return {String|Object[]} The formatted data
 */
const get = function (options) {
  const _data = deepCopy(this.data)

  let result

  const {format, type, style, lang, locale, template} = Object.assign(
    {format: 'real', type: 'json', style: 'csl', lang: 'en-US'},
    this._options,
    {locale: '', template: ''},
    options
  )

  const [, styleType, styleFormat] = style.match(/^([^-]+)(?:-(.+))?$/)

  switch ([type, styleType].join()) {
    case 'html,citation':
      const useLang = fetchCSLLocale(lang) ? lang : 'en-US'
      const useTemplate = template || fetchCSLStyle(styleFormat)
      const cbItem = fetchCSLItemCallback(_data)
      const cbLocale = locale ? () => locale : fetchCSLLocale

      const citeproc = fetchCSLEngine(styleFormat, useLang, useTemplate, cbItem, cbLocale)
      const sortedIds = citeproc.updateItems(this.getIds())

      let [{bibstart: bibStart, bibend: bibEnd}, bibBody] = citeproc.makeBibliography()
      bibBody = bibBody.map((element, index) => getPrefixedEntry(element, index, sortedIds))

      result = `${bibStart}${bibBody.join('<br />')}${bibEnd}`
      break

    case 'html,csl':
      result = getJSON(_data)
      break

    case 'html,bibtex':
      result = getBibTeX(_data, true)
      break

    case 'string,bibtex':
      result = getBibTeX(_data, false)
      break

    case 'html,bibtxt':
      result = getBibTxt(_data, true)
      break

    case 'string,bibtxt':
      result = getBibTxt(_data, false)
      break

    case 'string,citation':
      result = striptags(this.get(Object.assign({}, options, {type: 'html'})))
      break

    case 'string,csl':
      result = JSON.stringify(_data)
      break

    case 'json,csl':
      result = JSON.stringify(_data)
      break

    case 'json,bibtex':
    case 'json,bibtxt':
      result = JSON.stringify(_data.map(getBibTeXJSON))
      break

    case 'json,citation':
      console.error('[get]', `Combination type/style of json/citation-* is not valid: ${type}/${style}`)//
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
      result = tmp.childNodes
    }
  }

  return result
}

export { getIds, get }
