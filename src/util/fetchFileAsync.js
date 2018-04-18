import 'isomorphic-fetch'

/* global fetch */

/**
 * Fetch file (async)
 *
 * @access protected
 * @memberof Cite.util
 *
 * @param {String} url - The input url
 * @param {Object} opts - Request options
 *
 * @return {Promise<String>} The fetched string
 */
const fetchFileAsync = async function (url, opts = {}) {
  const reqOpts = {}
  if (opts.headers) {
    reqOpts.headers = opts.headers
    reqOpts.allowRedirectHeaders = Object.keys(opts.headers)
  }

  try {
    return fetch(url, reqOpts).then(response => response.text())
  } catch (e) {
    logger.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return '[]'
  }
}

export default fetchFileAsync
