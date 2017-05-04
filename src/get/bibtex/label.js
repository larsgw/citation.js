/**
 * Get a BibTeX label from CSL data
 * 
 * @access private
 * @method getBibTeXLabel
 * 
 * @param {CSL} src - Input CSL
 * 
 * @return {String} The label
 */
var getBibTeXLabel = function ( src ) {
  var res = ''
  
  if ( src.hasOwnProperty( 'author' ) && Array.isArray( src.author ) && src.author.length > 0 )
    res += src.author[ 0 ].family || src.author[ 0 ].literal
  
  if ( src.hasOwnProperty( 'year' ) )
    res += src.year
  else if ( src.issued && src.issued[ 0 ] && src.issued[ 0 ][ 'date-parts' ] )
    res += src.issued[ 0 ][ 'date-parts' ][ 0 ]
  
  if ( src.hasOwnProperty( 'title' ) )
    res += src.title.replace(/^(the|a|an) /i,'').split(' ')[ 0 ]
  
  return res
}

export default getBibTeXLabel