import parseBibTeXProp from './prop'
import parseBibTeXType from './type'

/**
 * Format BibTeX JSON data
 * 
 * @access private
 * @method parseBibTeXJSON
 * 
 * @param {Object[]} data - The input data
 * 
 * @return {CSL[]} The formatted input data
 */
var parseBibTeXJSON = function ( data ) {
  var output = []
  
  for ( var entryIndex = 0; entryIndex < data.length; entryIndex++ ) {
    var entry = data[ entryIndex ]
    
    for ( var prop in entry.properties ) {
      var val = parseBibTeXProp( prop, entry.properties[ prop ] )
      
      if ( val !== undefined )
        entry[ val[ 0 ] ] = val[ 1 ]
    }
    
    entry.type = parseBibTeXType( entry.type )
    entry.id   = entry.label
    
    delete entry.label
    delete entry.properties
    
    output[ entryIndex ] = entry
  }
  
  return output
}

export default parseBibTeXJSON