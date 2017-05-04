import varRegex from './regex'

/**
 * Get CSL from name
 * 
 * @access private
 * @method parseName
 * 
 * @param {String} str - string 
 * 
 * @return {Object} The CSL object
 */
var parseName = function ( str ) {
  
  if ( str.indexOf( ', ' ) > -1 )
    var arr = str.split( ', ' ).reverse()
  else
    var arr = str.split( varRegex.name )
  
  var obj = {
    given : arr[ 0 ]
  , family: arr[ 1 ]
  }
  
  return obj
}

export default parseName