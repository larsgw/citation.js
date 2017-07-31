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
  return this.log.length
}

/**
 * Returns an image of the object in the version specified.
 *
 * @method retrieveVersion
 * @memberof Cite
 * @this Cite
 *
 * @param {Number} [versnum=1] - The number of the version you want to retrieve. Illegel numbers: numbers under or equal to zero, floats, numbers above the current version of the object.
 *
 * @return {Cite} The version of the object with the version number passed. `undefined` if an illegal number is passed.
 */
const retrieveVersion = function (versnum = 1) {
  if (versnum <= 0 || versnum > this.currentVersion()) {
    return null
  } else {
    const [data, options] = this.log[versnum - 1]
    const image = new Cite(JSON.parse(data), JSON.parse(options))
    image.log = this.log.slice(0, versnum)
    return image
  }
}

/**
 * Returns the second to last saved image of the object.
 *
 * @method undo
 * @memberof Cite
 * @this Cite
 *
 * @param {Number} [number=1] - number of versions to go back.
 *
 * @return {Cite} The second to last version of the object. `undefined` if used on first version.
 */
const undo = function (number = 1) {
  return this.retrieveVersion(this.currentVersion() - number)
}

/**
 * Returns the last saved image of the object.
 *
 * @method undo
 * @memberof Cite
 * @this Cite
 *
 * @return {Cite} The last version of the object. `undefined` if used on first version.
 */
const retrieveLastVersion = function () {
  return this.retrieveVersion(this.currentVersion())
}

/**
 * Save an image of the current version of the object.
 *
 * @method save
 * @memberof Cite
 * @this Cite
 *
 * @return {Cite} The current version of the object.
 */
const save = function () {
  this.log.push([JSON.stringify(this.data), JSON.stringify(this._options)])

  return this
}

export { currentVersion, retrieveVersion, retrieveLastVersion, undo, save }
