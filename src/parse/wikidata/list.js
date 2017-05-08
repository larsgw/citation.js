import wdk from 'wikidata-sdk'

/**
 * Get Wikidata JSON from Wikidata IDs
 *
 * @access protected
 * @method parseWikidata
 *
 * @param {String} data - Wikidata IDs
 *
 * @return {Object} Wikidata JSON
 */
const parseWikidata = function (data) {
  return [].concat(wdk.getEntities(data.split(/(?:\s+|,\s*)/g), ['en']))
}

export default parseWikidata
