import request from 'sync-request'

/**
 * Fetch file
 *
 * @access protected
 * @method fetchFile
 *
 * @param {String} url - The input url
 *
 * @return {String} The fetched string
 */
const fetchFile = function (url) {
  try {
    return request('GET', url).getBody('utf8')
  } catch (e) {
    console.error('[set]', 'File could not be fetched')
    return undefined
  }
}

export default fetchFile
