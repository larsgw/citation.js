import {validateOutputOptions as validate} from './validate'

/**
 * @memberof Cite#
 *
 * @property {Cite~OutputOptions} defaultOptions - default output options
 */
const defaultOptions = {format: 'real', type: 'json', style: 'csl', lang: 'en-US'}

/**
 * Change the default options of a `Cite` object.
 *
 * @memberof Cite#
 *
 * @param {Cite~OutputOptions} options - The options for the output
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const options = function (options, log) {
  if (log) {
    this.save()
  }

  try {
    validate(options)
    Object.assign(this._options, options)
  } catch ({message}) {
    logger.warn('[options]', message)
  }

  return this
}

export { options, defaultOptions }
