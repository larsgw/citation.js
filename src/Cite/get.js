import { validateOutputOptions as validate } from './static'

import {format as formatData} from '../get/registrar'

import getBibTeXJSON from '../get/modules/bibtex/json'
import getBibTeX from '../get/modules/bibtex/text'
import getBibTxt from '../get/modules/bibtex/bibtxt'
import {getJsonWrapper as getJSON} from '../get/modules/json'

import parseCsl from '../parse/csl'

/**
 * Get a list of the data entry IDs, in the order of that list
 *
 * @memberof Cite#
 *
 * @return {Array<String>} List of IDs
 */
const getIds = function () {
  return this.data.map(entry => entry.id)
}

/**
 * Get formatted data from your object.
 *
 * @tutorial output
 * @memberof Cite#
 *
 * @param {Cite~OutputOptions} [options={}] - Output options
 *
 * @return {String|Array<Object>} The formatted data
 */
const get = function (options = {}) {
  try {
    validate(options)
  } catch ({message}) {
    logger.warn('[get]', message)
  }

  const {format, type, style, lang, append, prepend} = Object.assign({}, this.defaultOptions, this._options.output, options)
  const [, styleType, styleFormat] = style.match(/^([^-]+)(?:-(.+))?$/)

  const data = parseCsl(this.data)
  let result

  switch (styleType) {
    case 'citation':
      if (type === 'json') {
        logger.error('[get]', `Combination type/style of json/citation-* is not valid: ${type}/${style}`)
        break
      }

      result = formatData('bibliography', data, {
        template: styleFormat,
        lang,
        format: type === 'string' ? 'text' : type,
        append,
        prepend
      })
      // TODO 'string' -> 'text'
      break

    case 'csl':
      if (type === 'html') {
        result = getJSON(data)
      } else if (type === 'string') {
        result = JSON.stringify(data, null, 2)
      } else if (type === 'json') {
        result = JSON.stringify(data)
      }
      break

    case 'bibtex':
      if (type === 'html') {
        result = getBibTeX(data, true)
      } else if (type === 'string') {
        result = getBibTeX(data, false)
      } else if (type === 'json') {
        result = JSON.stringify(data.map(getBibTeXJSON))
      }
      break

    case 'bibtxt':
      if (type === 'html') {
        result = getBibTxt(data, true)
      } else if (type === 'string') {
        result = getBibTxt(data, false)
      } else if (type === 'json') {
        result = JSON.stringify(data.map(getBibTeXJSON))
      }
      break

    default:
      logger.error('[get]', 'Invalid options')
      break
  }

  if (format === 'real') {
    if (type === 'json') {
      result = JSON.parse(result)
    } else if (type === 'html' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
      const tmp = document.createElement('div')
      tmp.innerHTML = result
      result = tmp.firstChild
    }
  }

  return result
}

export { getIds, get }
