import Cite from './index'

/**
 *
 * @method currentVersion
 * @memberof Cite
 * @this Cite
 *
 * @return {Number} The latest version of the object
 */
const currentVersion = function () {
  return this._log.filter(entry => entry.hasOwnProperty('version')).pop().version
}

/**
 * Does not change the current object.
 *
 * @method retrieveVersion
 * @memberof Cite
 * @this Cite
 *
 * @param {Number} versnum - The number of the version you want to retrieve. Illegel numbers: numbers under zero, floats, numbers above the current version of the object.
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The version of the object with the version number passed. `undefined` if an illegal number is passed.
 */
const retrieveVersion = function (versnum, nolog) {
  if (!nolog) {
    this._log.push({name: 'retrieveVersion', arguments: [versnum]})
  }

  if (versnum < 0 || versnum > this.currentVersion()) {
    return undefined
  }

  const obj = new Cite(this._log[0].arguments[0], this._log[0].arguments[1])

  this._log.filter(entry => entry.hasOwnProperty('version')).slice(1, versnum).forEach(entry =>
    Cite.prototype[entry.name].apply(obj, entry.arguments || [])
  )

  return obj
}

/**
 * Does not change the current object. Undoes the last edit made.
 *
 * @method undo
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The last version of the object. `undefined` if used on first version.
 */
var undo = function (nolog) {
  if (!nolog) {
    this._log.push({name: 'undo'})
  }

  return this.retrieveVersion(this.currentVersion() - 1, true)
}

export { currentVersion, retrieveVersion, undo }
