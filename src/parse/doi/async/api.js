import 'isomorphic-fetch'

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
    console.error('[set]', 'File could not be fetched')
    return {}
  }
}

/**
 * Get CSL JSON from DOI API URLs.
 *
 * @access protected
 * @method parseDoiApiAsync
 *
 * @param {String|String[]} data - Wikidata DOIs
 *
 * @return {CSL[]} Array of CSL
 */
const parseDoiApiAsync = data => Promise.all([].concat(data).map(fetchDoiApiAsync))

export default parseDoiApiAsync
