import * as log from './log'
import * as options from './options'
import * as set from './set'
import * as sort from './sort'
import * as get from './get'

/**
 * Citation.js input data, see {@tutorial input_types}
 *
 * @typedef InputData
 * @tutorial input_types
 */

/**
 * Citation.js {@tutorial input_options}
 *
 * @typedef {Object} Cite~InputOptions
 * @tutorial input_options
 *
 * @property {Cite~OutputOptions} output
 * @property {Number} maxChainLength
 * @property {Boolean} generateGraph
 * @property {Cite.parse~format} forceType
 */

/**
 * Citation.js {@tutorial output_options}
 *
 * @typedef {Object} Cite~OutputOptions
 * @tutorial output_options
 *
 * @property {String} format
 * @property {String} type
 * @property {String} style
 * @property {String} lang
 * @property {String|Cite~wrapper} prepend
 * @property {String|Cite~wrapper} append
 */

/**
 * @callback Cite~wrapper
 * @param {CSL} data - Cite object
 * @return {String} wrapping string
 */

/**
 * [CSL](https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html#csl-json-items) object
 *
 * @typedef {Object} CSL
 */

/**
 * Create a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @access public
 * @constructor Cite
 *
 * @param {Cite~InputData} data - Input data
 * @param {Cite~InputOptions} [options={}] - Input options
 */
function Cite (data, options = {}) {
  // Making it Scope-Safe
  if (!(this instanceof Cite)) {
    return new Cite(data, options)
  }

  /**
   * The default options for the output. See [input options](../#cite.in.options)
   *
   * @access protected
   * @memberof Cite#
   *
   * @property {Cite~InputOptions} options
   */
  this._options = options || {}

  /**
   * The saved-images-log
   *
   * @access protected
   * @memberof Cite#
   *
   * @property {Array<Array<String>>} log
   */
  this.log = []

  /**
   * The parsed data
   *
   * @access protected
   * @memberof Cite#
   *
   * @property {Array<CSL>} data
   */
  this.data = []

  this.set(data, options)
  this.options(options)
  this.save()

  return this
}

Object.assign(Cite.prototype, log, options, set, sort, get)

Cite.prototype[Symbol.iterator] = function * () {
  yield * this.data
}

export default Cite
