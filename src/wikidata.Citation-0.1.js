/** 
 * @file wikidata.Citation-0.1.js
 * 
 * @description
 * # Description
 *
 * A Node.js package to transform Wikidata items from Q-numbers or Wikidata JSON to CSL-JSON
 * 
 * # Use
 * 
 *     var wdCite = require( './wikidata.Citation-0.1.js' )
 *     
 *     var urlInput = wdCite( <list of Q-numbers>, <lang> )
 *     
 *     var dataInput = wdCite( <array of Wikidata JSON Objects>, <lang>)
 * 
 * # Dependencies
 * 
 * * Node.js and following packages:
 *   * wikidata-sdk
 *   * sync-request
 *   * fs
 * * Optional Node.js packages:
 *   * progress
 *   * colors
 * 
 * <br /><br />
 * - - -
 * <br /><br />
 * 
 * @projectname Citationjs
 * 
 * @author Lars Willighagen
 * @version 0.1
 * @license
 * Copyright (c) 2016 Lars Willighagen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var wdk     = require( 'wikidata-sdk' )
  , request = require( 'sync-request' )
  , fs      = require( 'fs'           )
  , progress
  
  , progressBar = true

try {
  progress= require( 'progress' )
	    require( 'colors'   )
} catch (e) { progressBar = false }

/* --------------------------------- */
/* --------------------------------- */

var getDate = function ( value ) {
  var rValue
    , date = new Date( value )
  rValue = [
    ( date.getFullYear()     ).toString()
  , ( date.getMonth   () + 1 ).toString()
  , ( date.getDate    ()     ).toString()
  ]
  return rValue
}

var getLabel = function ( q, lang ) {
  var url = wdk.getEntities( q, [ lang ], 'labels' )
  
  var data     = request( 'GET', url ).getBody( 'utf8' )
    , entities = JSON.parse( data ).entities
  
    , entKeys  = Object.keys( entities )
    , labels   = []
  
  for ( var entIndex = 0; entIndex < entKeys.length; entIndex++ ) {
    var entKey = entKeys [ entIndex ]
      , entity = entities[ entKey   ]
    
    labels.push( entity.labels[ lang ].value )
  }
  
  return labels
}

var parseProp = function ( prop, value, lang ) { var value = value
  
  if ( !( [ ''
  , 'P50'
  , 'P2093'
  ].indexOf( prop ) > -1 ) ) value = value[ 0 ]
  
  var rProp = ''
    , rValue = value
  
  switch ( prop ) {
    
    // Author ( q )
    case 'P50':
      rProp = 'authorQ'
      rValue = value.map( function(v){ return { literal: getLabel( v, lang ) } } )
      break;
    
    // Author ( s )
    case 'P2093':
      rProp = 'authorS'
      rValue = value.map( function(v){ return { literal: v } } )
      break;
    
    // Date ( from )
    case 'P580' :
    case 'P585' :
      rProp = 'accessed'
      rValue = getDate( value )
      break;
    
    // DOI
    case 'P356' :
      rProp = 'DOI'
      break;
    
     // Instance of
    case 'P31'  :
      rProp = 'type'
      rValue = ( {
	Q13442814: 'article-journal'
      , Q18918145: 'article-journal'
      , Q191067  : 'article'
      , Q3331189 : 'book'
      , Q571     : 'book'
      }[ value ] || ( 'article-journal' +
	console.warn( '[set]', 'This entry type is not recognized and therefore interpreted as \'article-journal\'' ) || '' )
      )
      
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
      rProp = 'journal'
      rValue = getLabel( value, lang )[ 0 ]
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
      rValue = getDate( value )
      break;
    
    // Title
    case 'P1476':
      rProp = 'title'
      break;
    
    // Volume
    case 'P478' :
      rProp = 'volume'
      break;
    
    case 'P2860': // Cites
    case 'P364' : // Original lang of work
    case 'P698' : // PMID
    case 'P932' : // PMCID
      // Property ignored
      break;
    
    default:
      console.warn( '[set]', 'Property not recognised: ' + prop )
      break;
  }
  
  return [ rProp, rValue ]
}

/* --------------------------------- */

var getOutput = function ( url, lang ) {
  
  var output = []
  
  console.log( 'Receiving entity data...' )
  
  var data     = request( 'GET', url ).getBody( 'utf8' )
    , entities = JSON.parse( data ).entities
    , entKeys  = Object.keys( entities )
    
    , QProgress
  
  if ( progressBar ) { QProgress = new progress(
    '[:bar] Processing entity :current/:total: :q (eta :etas)',
    {
      complete: '='.green,
      width: 20,
      total: entKeys.length
    }
  ) } else console.log( 'Processing recieved entity data...' )
  
  for ( var entIndex = 0; entIndex < entKeys.length; entIndex++ ) {
    var entKey = entKeys [ entIndex ]
      , entity = entities[ entKey   ]
    
    entities[ entKey ] = wdk.simplifyClaims( entity.claims )
    
        entity = entities[ entKey   ]
    
    var json  = { wikiID: entKey, id: entKey }
      , props = Object.keys( entity )
    
    for ( var propIndex = 0; propIndex < props.length; propIndex++ ) {
      var prop  = props[ propIndex ]
        , value = entity[ prop ]
	
      var resp = parseProp( prop, value, lang )
      
      json[ resp[ 0 ] ] = resp[ 1 ]
      
      // Removing empty responses
      delete json[ '' ]
    }
      
    /*if ( json.hasOwnProperty( 'dateFrom' ) || json.hasOwnProperty( 'dateTo' ) ) {
      json.date = {}
      if ( json.hasOwnProperty( 'dateFrom' ) ) {
	json.date.from = json.dateFrom
	delete           json.dateFrom }
      
      if ( json.hasOwnProperty( 'dateTo'   ) ) {
	json.date.to   = json.dateTo
	delete           json.dateTo   }
    }*/
    if ( json.hasOwnProperty( 'authorQ' ) || json.hasOwnProperty( 'authorS' ) ) {
      
      if ( json.hasOwnProperty( 'authorQ' ) && json.hasOwnProperty( 'authorS' ) ) {	
	if ( json.authorQ.length >= json.authorS.length )
	  json.author = json.authorQ
	else if ( json.authorQ.length < json.authorS.length )
	  json.author = json.authorS
	
	delete        json.authorQ
	delete        json.authorS
      } else if ( json.hasOwnProperty( 'authorQ' ) ) {
	json.author = json.authorQ
	delete        json.authorQ
      } else if ( json.hasOwnProperty( 'authorS' ) ) {
	json.author = json.authorS
	delete        json.authorS
      }
    }
    
    output.push( json )
    
    if ( progressBar ) QProgress.tick( {
      q: entKey
    } )
  }
  
  if ( !progressBar ) console.log( 'Processing finished' )
  console.log( 'Exiting Wikidata module...' )
  
  return output
}

var handleInput = function ( input, lang ) {
  
  console.log( 'Entering Wikidata module...' )
  
  var call = 'getEntities'
    , result
  
  if ( Array.isArray( input ) && wdk.isWikidataEntityId( input[ 0 ] ) ) {
    if ( input.length >= 50 )
      call = 'getManyEntities'
  } else if ( typeof input === 'string' && wdk.isWikidataEntityId( input ) ) {
    input = [ input ]
  }
  
  var url = wdk[ call ]( {
    ids: input,
    languages: [ lang ]
  } )
  
  if ( Array.isArray( url ) ) {
    var urls = url
      , outs = []
    
    for ( var urlIndex = 0; urlIndex < urls.length; urlIndex++ ) {
      var url = urls[ urlIndex ]
        , out = getOutput( url, lang )
          outs= outs.concat( out )
    }
    
    result = outs
  } else result = getOutput( url, lang )
  
  return result
}

/* --------------------------------- */
/* --------------------------------- */

module.exports = handleInput