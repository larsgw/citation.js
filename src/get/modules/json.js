/**
 * @module output/json
 */

import deepCopy from '../../util/deepCopy.js'
import {has as hasDict, get as getDict} from '../dict'

/**
 * Append commas to every item but the last. Should unfortunately, probably be a utility.
 *
 * @access private
 *
 * @param {String} item
 * @param {Number} index
 * @param {Array<String>} array
 *
 * @return {String} modified item
 */
const appendCommas = (string, index, array) => string + (index < array.length - 1 ? ',' : '')

/**
 * Convert a JSON array or object to HTML.
 *
 * @access private
 *
 * @param {Object|Array} src - The data
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} string form
 */
const getJsonObject = function (src, dict) {
  const isArray = Array.isArray(src)
  let entries

  if (isArray) {
    entries = src.map(entry => getJsonValue(entry, dict))
  } else {
    entries = Object.entries(src).map(([prop, value]) => `"${prop}": ${getJsonValue(value, dict)}`)
  }

  entries = entries.map(appendCommas).map(entry => dict.listItem.join(entry))
  entries = dict.list.join(entries.join(''))

  return isArray ? `[${entries}]` : `{${entries}}`
}

/**
 * Convert JSON to HTML.
 *
 * @access private
 *
 * @param {*} src - The data
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} string form
 */
const getJsonValue = function (src, dict) {
  if (typeof src === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]'
    } else if (Object.keys(src).length === 0) {
      return '{}'
    } else {
      return getJsonObject(src, dict)
    }
  } else {
    return JSON.stringify(src) + ''
  }
}

/**
 * Get a JSON string from CSL
 *
 * @access protected
 * @method getJson
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} JSON string
 */
const getJson = function (src, dict) {
  let entries = src.map(entry => getJsonObject(entry, dict))
  entries = entries.map(appendCommas).map(entry => dict.entry.join(entry))
  entries = entries.join('')

  return dict.bibliographyContainer.join(`[${entries}]`)
}

/**
 * Get a JSON HTML string from CSL
 *
 * @access protected
 * @method getJsonWrapper
 * @deprecated use the generalised method: {@link module:output/json~getJson}
 *
 * @param {Array<CSL>} src - Input CSL
 *
 * @return {String} JSON HTML string
 */
const getJsonWrapper = function (src) {
  return getJson(src, getDict('html'))
}

export {getJsonWrapper}
export default {
  data (data, {type, format = type || 'text'} = {}) {
    if (format === 'object') {
      return deepCopy(data)
    } else if (format === 'text') {
      return JSON.stringify(data, null, 2)
    } else {
      logger.warn('[get]', 'This feature (JSON output with special formatting) is unstable. See https://github.com/larsgw/citation.js/issues/144')
      return hasDict(format) ? getJson(data, getDict(format)) : ''
    }
  }
}
