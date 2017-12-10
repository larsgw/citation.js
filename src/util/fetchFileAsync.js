import 'isomorphic-fetch'

/* global fetch */

/**
 * Fetch file (async)
 *
 * @access protected
 * @memberof Cite.util
 *
 * @param {String} url - The input url
 *
 * @return {Promise<String>} The fetched string
 */
const fetchFileAsync = async function (url) {
  try {
    return (await fetch(url)).text()
  } catch (e) {
    logger.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return '[]'
  }
}

export default fetchFileAsync
