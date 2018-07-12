import {chainAsync as parseInputAsync} from '../parse/'
import Cite from './index'

/**
 * @callback Cite~asyncCallback
 * @param {Cite} data - Cite object
 */

/**
 * @access private
 *
 * @param {Promise<Array<CSL>>} data - promise returning parsed input
 * @param {Cite~InputOptions} [options] - cite options
 * @return {Promise<Cite>} promise returning Cite object
 */
const asyncCite = async function (data, options) {
  return new Cite(await data, options)
}

/**
 * @access public
 * @memberof Cite
 *
 * @param {Cite~InputData} data - input data
 * @param {Cite~InputOptions} [options={}] - cite options
 * @param {Cite~asyncCallback} [callback] - if not given, function returns promise.
 *
 * @return {Promise<Cite>} if callback is omitted, returns a promise
 */
const async = function (data, options, callback) {
  const promise = parseInputAsync(data)

  if (typeof options === 'function' && !callback) {
    callback = options
    options = undefined
  }

  if (typeof callback === 'function') {
    promise.then(data => callback(new Cite(data, options)))
    return undefined
  } else {
    return asyncCite(promise, options)
  }
}

export default async
