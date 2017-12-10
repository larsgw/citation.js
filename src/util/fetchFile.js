import request from 'sync-request'

/**
 * Fetch file
 *
 * @access protected
 * @memberof Cite.util
 *
 * @param {String} url - The input url
 *
 * @return {String} The fetched string
 */
const fetchFile = function (url) {
  try {
    return request('GET', url).getBody('utf8')
  } catch (e) {
    logger.error('[set]', `File '${url}' could not be fetched:`, e.message)
    return '[]'
  }
}

export default fetchFile
