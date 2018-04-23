import {validateOutputOptions as validate} from './static'
import {format as formatData} from '../get/registrar'
import {csl as parseCsl} from '../parse/'

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
 * @memberof Cite#
 *
 * @param {String} format - format module name
 * @param {...*} options - module options (see relevant documentation)
 *
 * @return {String|Arrat<Object>} formatted data
 */
const format = function (format, ...options) {
  return formatData(format, parseCsl(this.data), ...options)
}

/**
 * Get formatted data from your object.
 *
 * @tutorial output
 * @memberof Cite#
 * @deprecated use {@link Cite#format}
 *
 * @param {Cite~OutputOptions} [options={}] - Output options
 *
 * @return {String|Array<Object>} The formatted data
 */
const get = function (options = {}) {
  try {
    validate(options)
  } catch ({message}) {
    logger.error('[get]', message)
  }

  const parsedOptions = Object.assign({}, this.defaultOptions, this._options.output, options)

  const {type, style} = parsedOptions
  const [styleType, styleFormat] = style.split('-')
  const newStyle = styleType === 'citation' ? 'bibliography' : styleType === 'csl' ? 'data' : styleType
  const newType = type === 'string' ? 'text' : type === 'json' ? 'object' : type

  let formatOptions

  switch (newStyle) {
    case 'bibliography':
      const {lang, append, prepend} = parsedOptions
      formatOptions = {template: styleFormat, lang, format: newType, append, prepend}
      break

    case 'data':
    case 'bibtex':
    case 'bibtxt':
      formatOptions = {type: newType}
      break

    default:
      logger.error('[get]', 'Invalid options')
      break
  }

  const result = this.format(newStyle, formatOptions)

  const {format} = parsedOptions
  if (format === 'real' && newType === 'html' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const tmp = document.createElement('div')
    tmp.innerHTML = result
    return tmp.firstChild
  } else if (format === 'string' && typeof result === 'object') {
    return JSON.stringify(result)
  } else {
    return result
  }
}

export {format, getIds, get}
