/**
 * Convert a CSL date into human-readable format
 * 
 * @access private
 * @function getDate
 * 
 * @param {String[]} date - A date in CSL format
 * 
 * @return {String} The string
 */
var getDate = function ( date ) {
  var res  = ''
    , date = date[ 0 ][ 'date-parts' ]
  
  if ( date.length === 3 )
    res += [
      ('000'+ date[ 0 ] ).slice( -4 )
    , ( '0' + date[ 1 ] ).slice( -2 )
    , ( '0' + date[ 2 ] ).slice( -2 )
    ].join( '-' )
  
  return res
}

export default getDate