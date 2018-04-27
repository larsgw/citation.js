/**
 * @module input/other
 */

/**
 *
 * @access private
 * @constant substituters
 * @default
 */
const substituters = [
  [
    /((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g,
    '$1"$2"'
  ],
  [
    /((?:(?:"|]|}|\/[gmiuys]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g,
    '$1"$2$3$4"$5:'
  ]
]

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
    logger.info('[set]', 'Input was not valid JSON, switching to experimental parser for invalid JSON')
    try {
      substituters.forEach(([regex, subst]) => { str = str.replace(regex, subst) })
      return JSON.parse(str)
    } catch (e) {
      logger.error('[set]', 'Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.')
      return undefined
    }
  }
}

export {
  parseJSON as parse,
  parseJSON as default
}
