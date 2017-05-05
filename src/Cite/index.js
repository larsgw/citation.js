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
   * The log, containing all logged data.
   *
   * These are the names of each called function, together with it's input. If the `Cite` object is changed, the version number gets updated as well.
   *
   * The `.reset()` function **does not** have any influence on the log. This way, you can still undo all changes.
   *
   * <br /><br />
   * `.currentVersion()` and similar function **are not** logged, because this would be influenced by function using other functions.
   *
   * @type Object[]
   *
   * @property {Object} 0 - The first version, indicated with version 0, containing the object as it was when it was made. The following properties are used for the following properties too.
   * @property {String} 0.name - The name of the called function. In case of the initial version, this is `"init"`.
   * @property {String} 0.version - The version of the object. Undefined when a function that doesn't change the object is called.
   * @property {Array} 0.arguments - The arguments passed in the called function.
   */
  this._log = [
    {name: 'init', version: 0, arguments: [this._input.data, this._options]}
  ]

  this.set(data, true)
  this.options(options, true)

  return this
}

Object.assign(Cite.prototype, log, options, set, sort, get)

export default Cite
