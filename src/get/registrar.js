/**
 * @namespace output
 * @memberof Cite.plugins
 */

import Register from '../util/register'

/**
 * @callback Cite.plugins.output~formatter
 * @param {Array<InputData>}
 * @return {String} output
 */

/**
 * @typedef Cite.plugins.output~formatterName
 * @type String
 */

/**
 * Validate input arguments
 *
 * @access private
 * @memberof Cite.plugins.output
 *
 * @param {String} name - output format name
 * @param {Cite.plugins.output~formatter} formatter - outputting function
 * @throw {TypeError} Invalid output format name
 * @throw {TypeError} Invalid formatter
 */
const validate = (name, formatter) => {
  if (typeof name !== 'string') {
    throw new TypeError(`Invalid output format name, expected string, got ${typeof name}`)
  } else if (typeof formatter !== 'function') {
    throw new TypeError(`Invalid formatter, expected function, got ${typeof formatter}`)
  }
}

/**
 * @access public
 * @memberof Cite.plugins.output
 * @constant register
 *
 * @type Cite.util.Register
 */
export const register = new Register()

/**
 * Add output plugin.
 *
 * @access public
 * @memberof Cite.plugins.output
 * @method add
 *
 * @param {Cite.plugins.output~formatterName} name - output format name
 * @param {Cite.plugins.output~formatter} formatter - outputting function
 * @throw {TypeError} validation errors
 */
export const add = (name, formatter) => {
  validate(name, formatter)

  register.set(name, formatter)
}

/**
 * Remove output plugin.
 *
 * @access public
 * @memberof Cite.plugins.output
 * @method remove
 *
 * @param {Cite.plugins.output~formatterName} name - output format name
 */
export const remove = (name) => {
  register.remove(name)
}

/**
 * Check if output plugin exists.
 *
 * @access public
 * @memberof Cite.plugins.output
 * @method has
 *
 * @param {Cite.plugins.output~formatterName} name - output format name
 * @return {Boolean} register has plugin
 */
export const has = (name) => {
  return register.has(name)
}

/**
 * List output plugins.
 *
 * @access public
 * @memberof Cite.plugins.output
 * @method list
 *
 * @return {Array<String>} list of plugins
 */
export const list = () => {
  return register.list()
}

/**
 * Call output plugin
 *
 * @access public
 * @memberof Cite.plugins.output
 * @method format
 *
 * @param {Cite.plugins.output~formatterName} name - output format name
 * @param {Array<CSL>} data - all entries
 * @param {...*} options - output options
 */
export const format = (name, data, ...options) => {
  if (!register.has(name)) {
    logger.error('[get]', `Output plugin "${name}" unavailable`)
    return undefined
  }
  return register.get(name)(data, ...options)
}
