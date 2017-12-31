const formats = ['real', 'string']
const types = ['json', 'html', 'string', 'rtf']
const styles = ['csl', 'bibtex', 'bibtxt', 'citation-*']
const wrapperTypes = ['string', 'function']

/**
 * @access public
 * @memberof Cite
 *
 * @param {Cite~OutputOptions} - options
 *
 * @return {Boolean} true (if valid)
 * @throw {TypeError} Options not an object
 * @throw {TypeError} Invalid options
 * @throw {Error} Invalid options combination
 *
 * @todo check registers if styles and langs are present
 */
const validateOutputOptions = function (options) {
  if (typeof options !== 'object') {
    throw new TypeError('Options not an object!')
  }

  const {format, type, style, lang, append, prepend} = options

  if (format && !formats.includes(format)) {
    throw new TypeError(`Option format ("${format}") should be one of: ${formats}`)
  } else if (type && !types.includes(type)) {
    throw new TypeError(`Option type ("${type}") should be one of: ${types}`)
  } else if (style && !styles.includes(style) && !/^citation/.test(style)) {
    throw new TypeError(`Option style ("${style}") should be one of: ${styles}`)
  } else if (lang && typeof lang !== 'string') {
    throw new TypeError(`Option lang should be a string, but is a ${typeof lang}`)
  } else if (prepend && !wrapperTypes.includes(typeof prepend)) {
    throw new TypeError(`Option prepend should be a string or a function, but is a ${typeof prepend}`)
  } else if (append && !wrapperTypes.includes(typeof append)) {
    throw new TypeError(`Option append should be a string or a function, but is a ${typeof append}`)
  }

  if (/^citation/.test(style) && type === 'json') {
    throw new Error(`Combination type/style of json/citation-* is not valid: ${type}/${style}`)
  }

  return true
}

/**
 * @access public
 * @memberof Cite
 *
 * @param {Cite~InputOptions} - options
 *
 * @return {Boolean} true (if valid)
 * @throw {TypeError} Options not an object
 * @throw {TypeError} Invalid options
 *
 * @todo check registers if type is present
 */
const validateOptions = function (options) {
  if (typeof options !== 'object') {
    throw new TypeError('Options not an object!')
  }

  if (options.output) {
    validateOutputOptions(options.output)
  } else if (options.maxChainLength && typeof options.maxChainLength !== 'number') {
    throw new TypeError('Option maxChainLength should be a number')
  } else if (options.forceType && typeof options.forceType !== 'string') {
    throw new TypeError('Option forceType should be a string')
  }

  // options.generateGraph can be any falsy/truthy value, which is any value

  return true
}

export {validateOptions, validateOutputOptions}
