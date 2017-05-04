/**
 * Retrieve CSL item callback function
 * 
 * @access private
 * @method fetchCSLItemCallback
 * 
 * @param {CSL[]} data - CSL array
 * 
 * @return {Cite~retrieveItem} Code to retreive item
 */
var fetchCSLItemCallback = function ( data ) {
  var _data = data
  var fetchCSLItem = function ( id ) {
    var res
    
    for ( var entryIndex = 0; entryIndex < _data.length; entryIndex++ ) {
      var entry = _data[ entryIndex ]
      
      if ( entry.id === id )
        res = entry
    }
    
    if ( !res && parseInt( id ) + 1 )
      res = _data[ id ]
    
    return res
  }
  return fetchCSLItem
}

export default fetchCSLItemCallback