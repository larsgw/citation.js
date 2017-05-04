import varRegex from '../regex'

import fetchFile from '../../util/fetchFile'
import parseInput from './chain'
import parseWikidata from '../wikidata/list'
import parseWikidataJSON from '../wikidata/json'
import parseContentMine from '../bibjson/index'
import parseBibTeX from '../bibtex/text'
import parseBibTeXJSON from '../bibtex/json'
import parseJSON from '../json'

/**
 * Standardise input (internal use)
 * 
 * @access private
 * @method parseInputData
 * 
 * @param {String|String[]|Object|Object[]} input - The input data
 * @param {String} type - The input type
 * 
 * @return {CSL[]} The parsed input
 */
var parseInputData = function ( input, type ) {
  var output
  
  switch ( type ) {
    
    case 'string/wikidata':
      output = parseWikidata( input.match( varRegex.wikidata[ 0 ] )[ 1 ] )
      break;
    
    case 'list/wikidata':
      output = parseWikidata( input.match( varRegex.wikidata[ 1 ] )[ 1 ] )
      break;
    
    case 'api/wikidata':
      output = fetchFile( input )
      break;
    
    case 'url/wikidata':
      output = parseWikidata( input.match( varRegex.wikidata[ 3 ] )[ 1 ] )
      break;
    
    case 'array/wikidata':
      output = parseWikidata( input.join(',') )
      break;
    
    case 'url/else':
      output = fetchFile( input )
      break;
    
    case 'jquery/else':
      output = data.val() || data.text() || data.html()
      break;
    
    case 'html/else':
      output = data.value || data.textContent
      break;
    
    case 'string/json':
      output = parseJSON( input )
      break;
    
    case 'string/bibtex':
      output = parseBibTeXJSON( parseBibTeX( input ) )
      break;
    
    case 'object/wikidata':
      output = parseWikidataJSON( input )
      break;
    
    case 'object/contentmine':
      output = parseContentMine( input )
      break;
    
    case 'array/else':
      output = []
      input.forEach( function ( value ) {
        output = output.concat( parseInput( value ) )
      } )
      break;
    
    case 'object/csl':
      output = [ input ]
      break;
    
    case 'array/csl':
      output = input
      break;
    
    case 'string/empty':
    case 'string/whitespace':
    case 'empty'  :
    case 'invalid':
    default       :
      output = []
      break;
    
  }
  
  return output
}

export default parseInputData