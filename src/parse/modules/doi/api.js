/**
 * @module input/doi
 */

import parseDoiJson from './json'
import fetchFile from '../../../util/fetchFile'
import fetchFileAsync from '../../../util/fetchFileAsync'

/**
 * DOI API headers
 *
 * @access private
 */
const apiHeaders = {
  Accept: 'application/vnd.citationstyles.csl+json'
}

/**
 * Fetch DOI API results
 *
 * @access private
 * @method fetchDoiApiAsync
 *
 * @param {String} url - The input url
 *
 * @return {Promise<CSL>} The fetched JSON
 */
const fetchDoiApiAsync = async function (url) {
  const result = await fetchFileAsync(url, {headers: apiHeaders})
  return result === '[]' ? {} : JSON.parse(result)
}

/**
 * Get CSL JSON from DOI API URLs.
 *
 * @access protected
 * @method parseDoiApiAsync
 *
 * @param {String|Array<String>} data - DOIs
 *
 * @return {Promise<Array<CSL>>} Array of CSL
 */
const parseDoiApiAsync = async function (data) {
  const doiJsonList = await Promise.all([].concat(data).map(fetchDoiApiAsync))
  return doiJsonList.map(parseDoiJson)
}

/**
 * Fetch DOI API results
 *
 * @access private
 * @method fetchDoiApi
 *
 * @param {String} url - The input url
 *
 * @return {CSL} The fetched JSON
 */
const fetchDoiApi = function (url) {
  const result = fetchFile(url, {headers: apiHeaders})
  return result === '[]' ? {} : JSON.parse(result)
}

/**
 * Get CSL JSON from DOI API URLs.
 *
 * @access protected
 * @method parseDoiApi
 *
 * @param {String|Array<String>} data - DOIs
 *
 * @return {Array<CSL>} Array of CSL
 */
const parseDoiApi = data => [].concat(data).map(fetchDoiApi).map(parseDoiJson)

export {
  parseDoiApi as parse,
  parseDoiApiAsync as parseAsync
}
