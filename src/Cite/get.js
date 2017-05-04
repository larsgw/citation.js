import striptags from 'striptags'

import { getAttributedEntry, getPrefixedEntry } from '../util/attr.js'

import getBibTeXJSON from '../get/bibtex/json'
import getBibTeX from '../get/bibtex/text'
import getJSON from '../get/html/json'

import fetchCSLEngine from '../CSL/engines'
import fetchCSLStyle from '../CSL/styles'
import fetchCSLLocale from '../CSL/locales'
import fetchCSLItemCallback from '../CSL/items'

/**
 * Get a list of the data entry IDs, in the order of that list
 * 
 * @method getIds
 * @memberof Cite
 * @this Cite
 * 
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 * 
 * @return {String[]} List of IDs
 */
var getIds = function ( nolog ) {
  if( !nolog )
    this._log.push( { name: 'getIds' } )
  
  var list = []
  
  for ( var entryIndex = 0; entryIndex < this.data.length; entryIndex++ )
    list.push( this.data[ entryIndex ].id )
  
  return list
}

/**
 * Get formatted data from your object. For more info, see [Output](../#output).
 * 
 * @method get
 * @memberof Cite
 * @this Cite
 * 
 * @param {Object} options - The options for the output
 * @param {String} [options.format="real"] - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
 * @param {String} [options.type="json"] - The format of the output. `"string"`, `"html"` or `"json"`
 * @param {String} [options.style="csl"] - The style of the output. See [Output](../#output)
 * @param {String} [options.lang="en-US"] - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
 * @param {String} [options.locale] - Custom CSL locale for citeproc
 * @param {String} [options.template] - Custom CSL style template for citeproc
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 * 
 * @return {String|Object[]} The formatted data
 */
var get = function ( options, nolog ) {
  if( !nolog )
    this._log.push( { name: 'get', arguments: [ options ] } )
  
  var _data   = JSON.parse( JSON.stringify( this.data ) )
    , result
    
    , options = Object.assign(
        { format:'real',type:'json',style:'csl',lang:'en-US' },
        this._options,
        { locale: '', template: '' },
        options )
    
    , type    = options.type.toLowerCase()
    , styleParts = options.style.toLowerCase().split( '-' )
    , style   = styleParts[ 0 ]
    , styleFormat = styleParts.slice( 1 ).join( '-' )
  
  switch ( type ) {
    case 'html':
      
      switch ( style ) {
        
        case 'citation':
          var cb_locale = !options.locale ? fetchCSLLocale : function () { return options.locale }
            , cb_item   = fetchCSLItemCallback( _data )
            , template  = options.template ? options.template : fetchCSLStyle( styleFormat )
            , lang      = fetchCSLLocale( options.lang ) ? options.lang : 'en-US'
            , citeproc  = fetchCSLEngine( styleFormat, lang, template, cb_item, cb_locale )
            
            , sortIds   = citeproc.updateItems( this.getIds( true ) )
            , bib       = citeproc.makeBibliography()
            
            , start     = bib[ 0 ].bibstart
            , body      = bib[ 1 ]
            , end       = bib[ 0 ].bibend
          
          for ( var i = 0; i < body.length; i++ ) {
            body[ i ] = getPrefixedEntry( body[ i ], i, sortIds )
          }
          
          result = start + body.join( '<br />' ) + end
          break;
        
        case 'csl':
          result = getJSON( _data )
          break;
        
        case 'bibtex':
          result = getBibTeX( _data, true )
          break;
      }
      
      break;
    
    case 'string':
      
      switch ( style ) {
        
        case 'bibtex':
          result = getBibTeX( _data, false )
          break;
        
        case 'citation':
          var options = Object.assign( {}, options, {type:'html'} )
          result = striptags( this.get( options, true ) )
          break;
        
        case 'csl':
          result = JSON.stringify( _data )
          break;
      }
      
      break;
    
    case 'json':
      
      switch ( style ) {
        
        case 'csl':
          result = JSON.stringify( _data )
          break;
        
        case 'bibtex':
          result = JSON.stringify( _data.map( getBibTeXJSON ) )
          break;
        
        case 'citation':
          console.error( '[get]', 'Combination type/style of json/citation-* is not valid:', options.type + '/' + options.style )
          result = undefined
          break;
      }
      
      break;
  }
  
  if ( options.format === 'real' ) {
    if ( options.type === 'json' )
      result = JSON.parse( result )
    else if ( browserMode && options.type === 'html' ) {
      var tmp = document.createElement( 'div' )
      tmp.innerHTML = result
      result = result.childNodes
    }
  }
  
  return result
}

export { getIds, get }