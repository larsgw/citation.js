const register = {}

/**
 * @callback Cite.output~formatter
 * @param {Array<InputData>}
 * @return {String} output
 */

/**
 * @typedef Cite.output~formatterName
 * @type String
 */

/**
 * Validate input arguments
 *
 * @access private
 * @memberof Cite.get
 *
 * @param {String} name - output format name
 * @param {Cite.output~formatter} formatter - outputting function
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
 * Add output plugin.
 *
 * @access public
 * @memberof Cite.get
 *
 * @param {Cite.output~formatterName} name - output format name
 * @param {Cite.output~formatter} formatter - outputting function
 * @throw {TypeError} validation errors
 */
export const add = (name, formatter) => {
  validate(name, formatter)

  register[name] = formatter
}

/**
 * Remove output plugin.
 *
 * @access public
 * @memberof Cite.get
 *
 * @param {Cite.output~formatterName} name - output format name
 */
export const remove = (name) => {
  delete register[name]
}

/**
 * Check if output plugin exists.
 *
 * @access public
 * @memberof Cite.get
 *
 * @param {Cite.output~formatterName} name - output format name
 * @return {Boolean} register has plugin
 */
export const has = (name) => {
  return register.hasOwnProperty(name)
}

/**
 * List output plugins.
 *
 * @access public
 * @memberof Cite.get
 *
 * @return {Array<String>} list of plugins
 */
export const list = () => {
  return Object.keys(register)
}

/**
 * Call output plugin
 *
 * @access public
 * @memberof Cite.get
 *
 * @param {Cite.output~formatterName} name - output format name
 * @param {...*} options - output options
 */
export const format = (name, ...options) => {
  if (!has(name)) {
    logger.error('[get]', `Output plugin "${name}" unavailable`)
    return undefined
  }
  return register[name](...options)
}
