import wdk from 'wikidata-sdk'

/**
 * Get Wikidata JSON from Wikidata IDs
 * 
 * @access private
 * @method parseWikidata
 * 
 * @param {String} data - Wikidata IDs
 * 
 * @return {Object} Wikidata JSON
 */
var parseWikidata = function ( data ) {
  var data = data.split( /(?:\s+|,\s*)/g )
  
  return [].concat(wdk.getEntities( data, [ 'en' ] ))
}

export default parseWikidata