import {chain as parseInput, chainAsync as parseInputAsync} from '../parse/'
import fetchId from '../util/fetchId'

/**
 * Add an object to the array of objects
 *
 * @memberof Cite#
 *
 * @param {Cite~InputData} data - The data to add to your object
 * @param {Object} [options={}] - [Options](../#cite.in.options)
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const add = function (data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save()
  }

  this.data.push(...parseInput(data, options))

  this.data.filter(entry => !entry.hasOwnProperty('id')).forEach(entry => {
    entry.id = fetchId(this.getIds(), 'temp_id_')
  })

  return this
}

/**
 * Add an object to the array of objects
 *
 * @memberof Cite#
 *
 * @param {Cite~InputData} data - The data to add to your object
 * @param {Object} [options={}] - [Options](../#cite.in.options)
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Promise<Cite>} The updated parent object
 */
const addAsync = async function (data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save()
  }

  this.data.push(...await parseInputAsync(data, options))

  this.data.filter(entry => !entry.hasOwnProperty('id')).forEach(entry => {
    entry.id = fetchId(this.getIds(), 'temp_id_')
  })

  return this
}

/**
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @memberof Cite#
 *
 * @param {Cite~InputData} data - Replacement data
 * @param {Object} [options={}] - [Options](../#cite.in.options)
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const set = function (data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save()
  }

  this.data = []
  return typeof options !== 'boolean' ? this.add(data, options) : this.add(data)
}

/**
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @memberof Cite#
 *
 * @param {Cite~InputData} data - Replacement data
 * @param {Object} [options={}] - [Options](../#cite.in.options)
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Promise<Cite>} The updated parent object
 */
const setAsync = async function (data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save()
  }

  this.data = []
  return typeof options !== 'boolean' ? this.addAsync(data, options) : this.addAsync(data)
}

/**
 * Reset a `Cite` object.
 *
 * @memberof Cite#
 *
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated, empty parent object (except the log, the log lives)
 */
const reset = function (log) {
  if (log) {
    this.save()
  }

  this.data = []
  this._options = {}

  return this
}

export { add, addAsync, set, setAsync, reset }
