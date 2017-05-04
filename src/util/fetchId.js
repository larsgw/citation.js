/**
 * Generate ID
 * 
 * @access private
 * @method fetchId
 * 
 * @param {String[]} list - old ID list
 * @param {Number} index - current ID index
 * @param {String} prefix - ID prefix
 * 
 * @return {String} CSL ID
 */
var fetchId = function ( list, index, prefix ) {
  var arr = list.slice()
    , id  = arr[ index ]
    , del = ','
  
  while ( true ) {
    arr[ index ] = id = prefix + Math.random().toString().slice( 2 )
    
    if (
      typeof id === 'string' &&
      ( arr.join( del ).match( `(?:^|${del})${id}(?:$|${del})` ) || [] ).length === 1
    ) break
  }
  
  return id
}

export default fetchId