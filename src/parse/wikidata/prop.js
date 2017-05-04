import wdk from 'wikidata-sdk'
import fetchFile from '../../util/fetchFile'

import fetchWikidataType from './type'
import parseDate from '../date'
import parseName from '../name'

/**
 * Get the names of objects from Wikidata IDs
 * 
 * @access private
 * @method fetchWikidataLabel
 * 
 * @param {String|String[]} q - Wikidata IDs
 * @param {String} lang - Language
 * 
 * @return {String[]} Array with labels of each prop
 */
var fetchWikidataLabel = function ( q, lang ) {
  var ids
  
  if ( Array.isArray( q ) )
    ids = q
  else if ( typeof q === 'string' )
    ids = q.split( '|' )
  else
    ids = ''
  
  var url = wdk.getEntities( ids, [ lang ], 'labels' )
  
  var data     = fetchFile( url )
    , entities = JSON.parse( data ).entities || {}
  
    , entKeys  = Object.keys( entities )
    , labels   = []
  
  for ( var entIndex = 0; entIndex < entKeys.length; entIndex++ ) {
    var entKey = entKeys [ entIndex ]
      , entity = entities[ entKey   ]
    
    labels.push( entity.labels[ lang ].value )
  }
  
  return labels
}

/**
 * Get series ordinal from qualifiers object
 * 
 * @access private
 * @method parseWikidataProp
 * 
 * @param {Object} qualifiers - qualifiers object
 * 
 * @return {Number} series ordinal or -1
 */
var parseWikidataP1545 = function ( qualifiers ) {
  if ( qualifiers.P1545 )
    return parseInt( qualifiers.P1545[ 0 ] )
  else
    return -1
}

/**
 * Transform property and value from Wikidata format to CSL
 * 
 * @access private
 * @method parseWikidataProp
 * 
 * @param {String} prop - Property
 * @param {String|Number} value - Value
 * @param {String} lang - Language
 * 
 * @return {String[]} Array with new prop and value
 */
var parseWikidataProp = function ( prop, value, lang ) {
  
  switch ( prop ) {
    case 'P50':
    case 'P2093':
      value = value.slice()
      break;
    
    default:
      value = value[ 0 ].value
      break;
  }
  
  var rProp = ''
    , rValue= value
  
  switch ( prop ) {
    
    // Author ( q )
    case 'P50':
      rProp = 'authorQ'
      rValue = value.map( function ( v ) {
        return [
          parseName( fetchWikidataLabel( v.value, lang )[ 0 ] )
        , parseWikidataP1545( v.qualifiers )
        ]
      } )
      break;
    
    // Author ( s )
    case 'P2093':
      rProp = 'authorS'
      rValue = value.map( function ( v ) {
        return [ parseName( v.value ), parseWikidataP1545( v.qualifiers ) ]
      } )
      break;
    
    // Date
    case 'P580' :
    case 'P585' :
      rProp = 'accessed'
      rValue = parseDate( value )
      break;
    
    // DOI
    case 'P356' :
      rProp = 'DOI'
      break;
    
    // Instance of
    case 'P31'  :
      rProp = 'type'
      rValue = fetchWikidataType( value )
      
      if ( rValue === undefined )
        console.warn( '[set]', 'This entry type is not recognized and therefore interpreted as \'article-journal\':', value ),
        rValue = 'article-journal'
      break;
    
    // ISBN 13 & 10
    case 'P212' :
    case 'P957' :
      rProp = 'ISBN'
      break;
    
    // Issue
    case 'P433' :
      rProp = 'issue'
      break;
    
    // Journal
    case 'P1433':
      rProp = 'container-title'
      rValue = fetchWikidataLabel( value, lang )[ 0 ]
      break;
    
    // Pages
    case 'P304' :
      rProp = 'page'
      break;
    
    // Print/edition
    case 'P393' :
      rProp = 'edition'
      break;
    
    // Pubdate
    case 'P577' :
      rProp = 'issued'
      rValue = parseDate( value )
      break;
    
    // Title
    case 'P1476':
      rProp = 'title'
      break;
    
    // URL
    case 'P953': // (full work available at)
      rProp = 'URL'
      break;
    
    // Volume
    case 'P478' :
      rProp = 'volume'
      break;
    
    case 'P2860': // Cites
    case 'P921' : // Main subject
    case 'P3181': // OpenCitations bibliographic resource ID
    case 'P364' : // Original language of work
    case 'P698' : // PMID
    case 'P932' : // PMCID
    case 'P1104': // Number of pages
      // Property ignored
      break;
    
    default:
      console.info( '[set]', 'Unknown property:', prop )
      break;
  }
  
  return [ rProp, rValue ]
}

export default parseWikidataProp