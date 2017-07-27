// TODO docs
const defaultOptions = {format: 'real', type: 'json', style: 'csl', lang: 'en-US'}

/**
 * Change the default options of a `Cite` object.
 *
 * @method options
 * @memberof Cite
 * @this Cite
 *
 * @param {Object} options - The options for the output. See [input options](../#citation.cite.in.options)
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const options = function (options, log) {
  if (log) {
    this.save()
  }

  Object.assign(this._options, options)

  return this
}

export { options, defaultOptions }
