/**
 * @module input/doi
 */

import request from 'sync-request'
import parseDoiJson from './json'

/* global fetch, Headers */

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
  try {
    const headers = new Headers()
    headers.append('Accept', 'application/vnd.citationstyles.csl+json')
    return (await fetch(url, {headers})).json()
  } catch (e) {
    logger.error('[set]', `File '${url}' could not be fetched:`, e.message)
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
  try {
    return JSON.parse(request('GET', url, {
      headers: {
        Accept: 'application/vnd.citationstyles.csl+json'
      },
      allowRedirectHeaders: ['Accept']
    }).getBody('utf8'))
  } catch (e) {
    logger.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return {}
  }
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

export const scope = '@doi'
export const types = '@doi/api'
export {
  parseDoiApi as parse,
  parseDoiApiAsync as parseAsync
}
