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
const parseDoi = data => data.split(/(?:\s+)/g).map(doi => `https://doi.org/${doi.trim()}`)

export default parseDoi
