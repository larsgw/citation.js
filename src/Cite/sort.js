import getLabel from '../get/label'

/**
 * Sort the datasets alphabetically, on basis of it's BibTeX label
 *
 * @method sort
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} log - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const sort = function (log) {
  if (log) {
    this.save()
  }

  this.data.sort((a, b) => {
    const labelA = getLabel(a)
    const labelB = getLabel(b)

    return labelA !== labelB ? (labelA > labelB ? 1 : -1) : 0
  })

  return this
}

export { sort }
