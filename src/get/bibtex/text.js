import getBibTeXJSON from './json'
import varHTMLDict from '../html/dict'

/**
 * Get a BibTeX (HTML) string from CSL
 * 
 * @access private
 * @method getBibTeX
 * 
 * @param {CSL[]} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 * 
 * @return {String} BibTeX (HTML) string
 */
var getBibTeX = function ( src, html ) {
  var res = ''
    , dict= varHTMLDict
  
  if ( html )
    res += dict.wr_start
  
  for ( var i = 0; i < src.length; i++ ) {
    var entry = src[ i ]
      , bib   = getBibTeXJSON( entry )
    
    if ( html )
      res += dict.en_start
    
    res += '@' + bib.type + '{' + bib.label + ','
    
    if ( html )
      res += dict.ul_start,
      res += dict.li_start
    else
      res += '\n'
    
    var props = Object.keys( bib.properties )
    
    for ( var propIndex = 0; propIndex < props.length; propIndex++ ) {
      var prop = props[ propIndex ]
        , value= bib.properties[ prop ].replace( /[|<>~^\\{}]/g, function ( match ) {
            return varBibTeXSyntaxTokens[ match ]
          } )
        , del_start=
        
          // Number
          value == parseInt( value ).toString() ? '' :
          // Title or other capital-related fields
          prop === 'title' ? '{{' :
          // Default
          '{'
          
        , del_end= del_start.replace( /{/g, '}' ).split( '' ).reverse().join( '' )
      
      if ( !html )
        res += '\t'
      
      res += prop + '=' + del_start + value + del_end + ','
      
      if ( propIndex + 1 < props.length ) {
      
        if ( html )
          res += dict.li_end,
          res += dict.li_start
        
      }
      
      if ( !html )
        res += '\n'
    }
    
    if ( html )
      res += dict.li_end,
      res += dict.ul_end
    
    res += '}'
    
    if ( html )
      res += dict.en_end
  }
  
  if ( html )
    res += dict.wr_end
  else
    res += '\n'
  
  return res
}

export default getBibTeX