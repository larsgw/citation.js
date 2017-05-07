import * as log from './log'
import * as options from './options'
import * as set from './set'
import * as sort from './sort'
import * as get from './get'

import parseInputType from '../parse/input/type'

/**
 * @constructor Cite
 *
 * @description Create a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - Input data. If no data is passed, an empty object is returned
 * @param {Object} options - The options for the output
 * @param {String} [options.format="real"] - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
 * @param {String} [options.type="json"] - The format of the output. `"string"`, `"html"` or `"json"`
 * @param {String} [options.style="csl"] - The style of the output. See [Output](./#output)
 * @param {String} [options.lang="en-US"] - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
 */
function Cite (data, options) {
  // Making it Scope-Safe
  if (!(this instanceof Cite)) {
    return new Cite(data, options)
  }

  /**
   * The default options for the output
   *
   * @property format {String} The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
   * @property type {String} The format of the output. `"string"`, `"html"` or `"json"`
   * @property style {String} The style of the output. See [Output](../#output)
   * @property lang {String} The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
   *
   * @type Object
   * @default {}
   */
  this._options = options || {}

  /**
   * Information about the input data
   *
   * @property data The inputted data
   * @property type {String} The datatype of the input
   * @property format {String} The format of the input
   *
   * @type Object
   */
  this._input = {
    data: data,
    type: typeof data,
    format: parseInputType(data)
  }

  /**
   * The data formatted to JSON
   *
   * @type Object
   * @default []
   */
  this.data = []

  /**
   * The log, containing all logged data, consisting of copies of the Cite object at different moments in time.
   *
   * The `.reset()` function **does not** reset on the log. This way, you can still undo all changes.
   *
   * <br /><br />
   * `.currentVersion()` and similar function **are not** logged, because this would be influenced by function using other functions.
   *
   * @type Object[]
   *
   * @property {Cite} 0 - The first image.
   */
  this.log = []

  this.set(data)
  this.options(options)
  this.save()

  return this
}

Object.assign(Cite.prototype, log, options, set, sort, get)

export default Cite
