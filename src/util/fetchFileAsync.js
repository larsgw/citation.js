import 'isomorphic-fetch'

/* global fetch */

/**
 * Fetch file (async)
 *
 * @access protected
 * @method fetchFileAsync
 *
 * @param {String} url - The input url
 *
 * @return {String} The fetched string
 */
const fetchFileAsync = async function (url) {
  try {
    return (await fetch(url)).text()
  } catch (e) {
    console.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return '[]'
  }
}

export default fetchFileAsync
