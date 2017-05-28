import * as log from './log'
import * as options from './options'
import * as set from './set'
import * as sort from './sort'
import * as get from './get'

/**
 * @constructor Cite
 *
 * @description Create a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - Input data. If no data is passed, an empty object is returned
 * @param {Object} options - The options for the output. See [input options](../#citation.cite.in.options).
 */
function Cite (data, options) {
  // Making it Scope-Safe
  if (!(this instanceof Cite)) {
    return new Cite(data, options)
  }

  /**
   * The default options for the output. See [input options](../#citation.cite.in.options)
   *
   * @memberof Cite
   * @access protected
   * @type Object
   * @default {}
   */
  this._options = options || {}

  /**
   * The log, containing all logged data, consisting of copies of the Cite object at different moments in time.
   *
   * The `.reset()` function **does not** reset on the log. This way, you can still undo all changes.
   *
   * <br /><br />
   * `.currentVersion()` and similar function **are not** logged, because this would be influenced by function using other functions.
   *
   * @memberof Cite
   * @access protected
   * @type Object[]
   *
   * @property {Cite} 0 - The first image.
   */
  this.log = []

  /**
   * The data formatted to JSON
   *
   * @memberof Cite
   * @access protected
   * @type Object
   * @default []
   */
  this.data = []

  this.set(data)
  this.options(options)
  this.save()

  return this
}

Object.assign(Cite.prototype, log, options, set, sort, get)

Cite.prototype[Symbol.iterator] = function * () {
  yield * this.data
}

export default Cite
