import fetchBibTeXType from './type'
import getBibTeXLabel from './label'
import getName from '../name'

/**
 * Get BibTeX-JSON from CSL(-JSON)
 * 
 * @access private
 * @method getBibTeXJSON
 * 
 * @param {CSL} src - Input CSL
 * 
 * @return {Object} Output BibTeX-JSON
 */
var getBibTeXJSON = function ( src ) {
  var src = JSON.parse( JSON.stringify( src ) )
    , res = {}
    , props = {}
  
  res.label = src.label || getBibTeXLabel( src )
  res.type  = fetchBibTeXType( src.type )
  
  if ( src.hasOwnProperty( 'author'    ) ) props.author    = src.author.slice().map( getName ).join( ' and ' )
  if ( src.hasOwnProperty( 'event'     ) ) props.organization = src.event
  if ( src.hasOwnProperty( 'accessed'  ) ) props.note      = '[Online; accesed ' + getDate( src.accessed ) + ']'
  if ( src.hasOwnProperty( 'DOI'       ) ) props.doi       = src.DOI
  if ( src.hasOwnProperty( 'editor'    ) ) props.editor    = src.editor.slice().map( getName ).join( ' and ' )
  if ( src.hasOwnProperty( 'ISBN'      ) ) props.isbn      = src.ISBN
  if ( src.hasOwnProperty( 'ISSN'      ) ) props.issn      = src.ISSN
  if ( src.hasOwnProperty( 'container-title' ) ) props.journal = src[ 'container-title' ]
  if ( src.hasOwnProperty( 'issue'     ) ) props.issue     = src.issue.toString()
  if ( src.hasOwnProperty( 'page'      ) ) props.pages     = src.page.replace( '-', '--' )
  if ( src.hasOwnProperty( 'publisher-place' ) ) props.address = src[ 'publisher-place' ]
  if ( src.hasOwnProperty( 'edition'   ) ) props.edition   = src.edition.toString()
  if ( src.hasOwnProperty( 'publisher' ) ) props.publisher = src.publisher
  if ( src.hasOwnProperty( 'title'     ) ) props.title     = src[ 'title' ]
  if ( src.hasOwnProperty( 'url'       ) ) props.url       = src.url
  if ( src.hasOwnProperty( 'volume'    ) ) props.volume    = src.volume.toString()
  if ( src.hasOwnProperty( 'issued'    )
    && Array.isArray( src.issued )
    && src.issued[ 0 ][ 'date-parts' ].length === 3
                                         ) props.year      = src.issued[ 0 ][ 'date-parts' ][ 0 ].toString()
  
  res.properties = props
  
  return res
}

export default getBibTeXJSON