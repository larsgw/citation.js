import parseDate from '../date'
import parseName from '../name'

/**
 * Format ContentMine data
 * 
 * @access private
 * @method parseContentMine
 * 
 * @param {Object} data - The input data
 * 
 * @return {CSL[]} The formatted input data
 */
var parseContentMine = function ( data ) {
  var res = {}
    
    , dataKeys = Object.keys( data )
  
  for ( var dataKeyIndex = 0; dataKeyIndex < dataKeys.length; dataKeyIndex++ ) {
    var prop = dataKeys[ dataKeyIndex ]
    res[ prop ] = data[ prop ].value[ 0 ]
  }
  
  res.type  = 'article-journal';
  
  if ( res.hasOwnProperty( 'authors'   ) ) res.author = data.authors.value.map( parseName )
  if ( res.hasOwnProperty( 'firstpage' ) ) res['page-first'] = res.firstpage,
                                           res.page   = res.firstpage
  if ( res.hasOwnProperty( 'date'      ) ) res.issued = parseDate( res.date )
  if ( res.hasOwnProperty( 'journal'   ) ) res['container-title'] = res.journal
  if ( res.hasOwnProperty( 'doi'       ) ) res.id     = res.doi, res.DOI = res.doi
  
  return res
}

export default parseContentMine