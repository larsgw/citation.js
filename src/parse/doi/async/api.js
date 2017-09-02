import 'isomorphic-fetch'
import parseDoiJson from '../json'

/* global fetch, Headers */

/**
 * Fetch DOI API results
 *
 * @access private
 * @method fetchDoiApiAsync
 *
 * @param {String} url - The input url
 *
 * @return {CSL} The fetched JSON
 */
const fetchDoiApiAsync = async function (url) {
  try {
    const headers = new Headers()
    headers.append('Accept', 'application/vnd.citationstyles.csl+json')
    return (await fetch(url, {headers})).json()
  } catch (e) {
    console.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return {}
  }
}

/**
 * Get CSL JSON from DOI API URLs.
 *
 * @access protected
 * @method parseDoiApiAsync
 *
 * @param {String|Array<String>} data - DOIs
 *
 * @return {Array<CSL>} Array of CSL
 */
const parseDoiApiAsync = async function (data) {
  const doiJsonList = await Promise.all([].concat(data).map(fetchDoiApiAsync))
  return doiJsonList.map(parseDoiJson)
}

export default parseDoiApiAsync
