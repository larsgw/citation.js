/**
 * Get name from CSL
 * 
 * @access private
 * @method getName
 * 
 * @param {Object} obj - CSL input
 * 
 * @return {String} Full name
 */
var getName = function ( obj ) {
  var arr = [ 'dropping-particle', 'given', 'suffix', 'non-dropping-particle', 'family' ]
    , res = ''
  
  for ( var i = 0; i < arr.length; i++ ) {
    if ( obj.hasOwnProperty( arr[ i ] ) )
      res += obj[ arr[ i ] ] + ' '
  }
  
  if ( res.length )
    res = res.slice( 0, -1 )
  else if ( res.hasOwnProperty( 'literal' ) )
    res = obj.literal
  
  return res
}

export default getName