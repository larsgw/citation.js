import parseInput from '../parse/input/chain'
import fetchId from '../util/fetchId'

/**
 * Add an object to the array of objects
 *
 * @method add
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - The data to add to your object
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated parent object
 */
const add = function (data, nolog) {
  if (!nolog) {
    this._log.push({name: 'add', version: this.currentVersion() + 1, arguments: [data, nolog]})
  }

  this.data = this.data
    .concat(parseInput(data))

  this.data
    .filter(entry => !entry.hasOwnProperty('id'))
    .forEach(entry => { entry.id = fetchId(this.getIds(true), 'temp_id_') })

  return this
}

/**
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @method set
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - The data to replace the data in your object
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated parent object
 */
const set = function (data, nolog) {
  if (!nolog) {
    this._log.push({name: 'set', version: this.currentVersion() + 1, arguments: [data, nolog]})
  }

  this.data = []
  this.add(data, true)

  return this
}

/**
 * Reset a `Cite` object.
 *
 * @method reset
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated, empty parent object (except the log, the log lives)
 */
const reset = function (nolog) {
  if (!nolog) {
    this._log.push({name: 'reset', version: this.currentVersion() + 1, arguments: []})
  }

  this.data = []
  this._options = {}

  return this
}

export { add, set, reset }
