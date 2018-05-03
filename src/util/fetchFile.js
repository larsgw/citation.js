import request from 'sync-request'

/**
 * Fetch file
 *
 * @access protected
 * @memberof Cite.util
 *
 * @param {String} url - The input url
 * @param {Object} opts - Request options
 *
 * @return {String} The fetched string
 */
const fetchFile = function (url, opts = {}) {
  const reqOpts = {}
  if (opts.headers) {
    reqOpts.headers = opts.headers
    reqOpts.allowRedirectHeaders = Object.keys(opts.headers)
  }

  try {
    return request('GET', url, reqOpts).getBody('utf8')
  } catch (e) {
    logger.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return '[]'
  }
}

export default fetchFile
