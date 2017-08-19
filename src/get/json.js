import { htmlDict as dict } from './dict'

/**
 * Convert a JSON array or object to HTML.
 *
 * @access private
 * @function getJSONObjectHTML
 *
 * @param {Object|Array<Object>|Array<String>|Array<Number>} src - The data
 *
 * @return {String} The html (in string form)
 */
const getJSONObjectHTML = function (src) {
  const join = `,${dict.li_end}${dict.li_start}`

  if (Array.isArray(src)) {
    const entries = src.map(entry => getJSONValueHTML(entry))
    return `[${dict.ul_start}${dict.li_start}${entries.join(join)}${dict.li_end}${dict.ul_end}]`
  } else {
    const props = Object.keys(src).map(prop => `"${prop}": ${getJSONValueHTML(src[prop])}`)
    return `{${dict.ul_start}${dict.li_start}${props.join(join)}${dict.li_end}${dict.ul_end}}`
  }
}

/**
 * Convert JSON to HTML.
 *
 * @access private
 * @function getJSONValueHTML
 *
 * @param {Object|String|Number|Array<Object>|Array<String>|Array<Number>} src - The data
 *
 * @return {String} The html (in string form)
 */
const getJSONValueHTML = function (src) {
  if (typeof src === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]'
    } else if (Object.keys(src).length === 0) {
      return '{}'
    } else {
      return getJSONObjectHTML(src)
    }
  } else {
    return JSON.stringify(src) + ''
  }
}

/**
 * Get a JSON HTML string from CSL
 *
 * @access protected
 * @method getJSON
 *
 * @param {Array<CSL>} src - Input CSL
 *
 * @return {String} JSON HTML string
 */
const getJSON = function (src) {
  const entries = src.map((entry, index, array) => {
    const comma = index < array.length - 1 ? ',' : ''
    const props = Object.keys(entry).map((prop, index, array) => {
      const comma = index < array.length - 1 ? ',' : ''
      return `${dict.li_start}"${prop}": ${getJSONValueHTML(entry[prop])}${comma}${dict.li_end}`
    }).join('')

    return `${dict.en_start}{${dict.ul_start}${props}${dict.ul_end}}${comma}${dict.en_end}`
  })

  return `${dict.wr_start}[${entries}]${dict.wr_end}`
}

export default getJSON
