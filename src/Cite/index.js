import * as log from './log'
import * as options from './options'
import * as set from './set'
import * as sort from './sort'
import * as get from './get'

/**
 * Create a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @access public
 * @constructor Cite
 *
 * @param {String|CSL|Object|Array<String>|Array<CSL>|Array<Object>} data - Input data
 * @param {Object} [options={}] - [Options](../#cite.in.options)
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
   * @memberof Cite
   *
   * @type Object
   * @default {}
   */
  this._options = options || {}

  /**
   * The saved-images-log
   *
   * @access protected
   * @memberof Cite
   *
   * @type Array<Object>
   * @property {Cite} 0 - The first image.
   */
  this.log = []

  /**
   * The parsed data
   *
   * @access protected
   * @memberof Cite
   *
   * @type Array<CSL>
   * @default []
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
