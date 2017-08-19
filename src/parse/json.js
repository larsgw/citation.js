import varRegex from './regex'

/**
 * Parse (in)valid JSON
 *
 * @access protected
 * @method parseJSON
 *
 * @param {String} str - The input string
 *
 * @return {Object|Array<Object>|Array<String>} The parsed object
 */
const parseJSON = function (str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.info('[set]', 'Input was not valid JSON, switching to experimental parser for invalid JSON')
    try {
      varRegex.json.forEach(([regex, subst]) => { str = str.replace(regex, subst) })
      return JSON.parse(str)
    } catch (e) {
      console.error('[set]', 'Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.')
      return undefined
    }
  }
}

export default parseJSON
