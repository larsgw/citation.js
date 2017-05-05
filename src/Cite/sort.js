import getLabel from '../get/label'

/**
 * Sort the datasets alphabetically, on basis of it's BibTeX label
 *
 * @method sort
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated parent object
 */
const sort = function (nolog) {
  if (!nolog) {
    this._log.push({name: 'sort', version: this.currentVersion() + 1, arguments: []})
  }

  this.data.sort((a, b) => {
    const labelA = getLabel(a)
    const labelB = getLabel(b)

    return labelA !== labelB ? (labelA > labelB ? 1 : -1) : 0
  })

  return this
}

export { sort }
