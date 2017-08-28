import parseInputAsync from '../parse/input/async/chain'
import Cite from '../Cite/index'

/**
 * @access private
 * @method asyncCite
 *
 * @param {Promise} promise - promise returning parsed input
 * @param {Object} options - The options for the output. See [input options](../#cite.in.options).
 * @return {Promise} promise returning Cite object
 */
const asyncCite = async function (promise, options) {
  return new Cite(await promise, options)
}

/**
 * @access public
 * @method async
 *
 * @param {String|CSL|Object|Array<String>|Array<CSL>|Array<Object>} data - Input data.
 * @param {Object} [options={}] - The options for the output. See [input options](../#cite.in.options).
 * @param {Cite~asyncCite} [callback] - if not given, function returns promise.
 * @return {Promise} If callback is not given, it returns a Promise. Else returns undefined.
 */
const async = function (data, options, callback) {
  const promise = parseInputAsync(data)

  if (typeof options === 'function' && !callback) {
    callback = options
  }

  if (typeof callback === 'function') {
    promise.then(data => callback(new Cite(data, options)))
    return undefined
  } else {
    return asyncCite(promise, options)
  }
}

export default async
