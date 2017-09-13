/**
 * @access private
 * @method getRegex
 * @param {Array<string>} options - enum of possible configs
 * @return {RegExp} regex
 */
const getRegex = options => new RegExp(`^(${options.join('|')})$`)

/**
 * @access public
 * @method validateOutputOptions
 *
 * @param {Object} - options
 *
 * @return {Boolean} true (if valid)
 * @throw {TypeError} Invalid options
 *
 * @todo check registers if styles and langs are present
 */
const validateOutputOptions = function (options) {
  const formats = ['real', 'string']
  const types = ['json', 'html', 'string']
  const styles = ['csl', 'bibtex', 'bibtxt', 'citation-(.*)']

  if (typeof options !== 'object') {
    throw new TypeError('Options not an object!')
  } else if (options.format && !getRegex(formats).test(options.format)) {
    throw new TypeError(`Option format should be one of: ${formats}`)
  } else if (options.type && !getRegex(types).test(options.type)) {
    throw new TypeError(`Option type should be one of: ${types}`)
  } else if (options.style && !getRegex(styles).test(options.style)) {
    throw new TypeError(`Option style should be one of: ${styles}`)
  } else if (options.lang && typeof options.lang !== 'string') {
    throw new TypeError('Option lang should be a string')
  } else if (options.prepend && !['string', 'function'].includes(typeof options.prepend)) {
    throw new TypeError('Option prepend should be a string or a function')
  } else if (options.append && !['string', 'function'].includes(typeof options.append)) {
    throw new TypeError('Option append should be a string or a function')
  }

  return true
}

/**
 * @access public
 * @method validateOutputOptions
 *
 * @param {Object} - options
 *
 * @throw {TypeError} Invalid options
 *
 * @return {Boolean} true (if valid)
 * @todo check registers if type is present
 */
const validateOptions = function (options) {
  if (options.output) {
    validateOutputOptions(options.output)
  } else if (options.maxChainLength && typeof options.maxChainLength !== 'number') {
    throw new TypeError('Option maxChainLength should be a number')
  } else if (options.forceType && typeof options.forceType !== 'string') {
    throw new TypeError('Option forceType should be a string')
  }

  return true
}

export {validateOptions, validateOutputOptions}
