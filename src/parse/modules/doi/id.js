/**
 * @module input/doi
 */

/**
 * Get DOI API URLs from DOI ID.
 *
 * @access protected
 * @method parseDoi
 *
 * @param {String} data - DOIs
 *
 * @return {Array<String>} DOI URLs
 */
const parseDoi = data => {
  const list = Array.isArray(data) ? data : data.trim().split(/(?:\s+)/g)
  return list.map(doi => `https://doi.org/${doi}`)
}

export {
  parseDoi as parse,
  parseDoi as default
}
