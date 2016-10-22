/** 
 * @file Citation-0.1.js
 * 
 * @description
 * 
 * Generate with `jsdoc src/ -r -c docs/conf.json -d docs/api/`
 * 
 * <br /><br />
 * - - -
 * <br /><br />
 * 
 * @projectname Citationjs
 * 
 * @author Lars Willighagen [lars.willighagen@gmail.com]
 * @version 0.1
 * @license
 * Copyright (c) 2015-2016 Lars Willighagen
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

// console.log(window.CSL,CSL);

(function(/*scope,module,nodejsMode,browserMode*/){


var  nodejsMode = ( typeof process  !== 'undefined' && typeof global   !== 'undefined' )
  , browserMode = ( typeof location !== 'undefined' && typeof document !== 'undefined' )

  /*( typeof window   !== 'undefined' ? window : {} )
, ( typeof module   !== 'undefined' ? module : {} )
, ( typeof process  !== 'undefined' && typeof global   !== 'undefined' )
, ( typeof location !== 'undefined' && typeof document !== 'undefined' )*/
  // console.log(window.CSL,CSL)

if ( nodejsMode ) {
  
  console.info( '[init]', 'Node.js mode' )
  
  var CSL = require( './node.citeproc.js' )
  
} else if ( browserMode ) {
  
  console.info( '[init]', 'Browser mode' )
  
} else throw new Error( 'Code executed in invalid enviroment' )

/**
 * Object containing several RegExp patterns, mostly used for parsing (*full of shame*) and recognizing data types
 * 
 * @default
 */
var rgx = {
  url:/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(\:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
, bibtex: [
    /(?:})(?=\s*@(?:.+?)\{\s*(?:\w+?)\s*,\s*(?:(?:\w+\s*=\s*(?:\{.+?\}|".+?"|\{\{.+?\}\})\s*,\s*)*(?:\w+\s*=\s*(?:\{.+?\}|".+?"|\{\{.+?\}\})\s*))\s*\})/g
  , /^\s*@(.+?)\{\s*(\w+?)\s*,\s*((?:\w+\s*=\s*(?:\{.+?\}|".+?"|\{\{.+?\}\})\s*,\s*)*(?:\w+\s*=\s*(?:\{.+?\}|".+?"|\{\{.+?\}\})\s*))\s*\}\s*$/
  
  , /,(?=\s*\w+\s*=\s*(?:\{.+?\}|".+?"|\{\{.+?\}\}))/g
  
  , [ /^\s*(?:\{\{|\{|")(.+?)(?:\}\}|\}|")\s*$/g
    , '$1' ]
  ]
, wikidata: [
    /(?:\/|^)(Q\d+)$/
  , /(Q\d+)/
  ]
, json:[
    [ /((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g
    , '$1"$2"' ]
    
  , [ /((?:(?:"|]|}|\/[gmi]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g
    , '$1"$2$3$4"$5:' ]
  ]
, name: /, | (?=(?:[a-z]+ )*(?:[A-Z][a-z]*[-])*(?:[A-Z][a-z]*)$)/
}

/**
 * Convert a CSL date into the correct format
 * 
 * @function getData
 * @param {Array} date - A date in CSL format
 * 
 * @return The string
 */
var getDate = function ( date ) {
  var res  = ''
    , date = date || {}
  
  if ( date.from && date.from.length !== 0 )
    res += (
      '{' +
	[
	  date.from[ 0 ]
	, ( '0' + date.from[ 1 ] ).slice( -2 )
	, ( '0' + date.from[ 2 ] ).slice( -2 )
	].join( '-' ) +
      '}'
    )
  
  return res;
}

/**
 * Get CSL from name
 * 
 * @method getCSLName
 * 
 * @param str The name
 * @return The CSL object
 */
var getCSLName = function ( str ) {
  var arr = str.split( rgx.name )
  return {
    given: arr[ 0 ]
  ,family: arr[ 1 ]
  }
}

/**
 * Get name from CSL
 * 
 * @method getName
 * 
 * @param obj CSL input
 * @return Full name
 */
var getName = function ( obj ) {
  return ( (
    ( obj['dropping-particle']     || '' ) +
    ( obj['given']                 || '' ) +
    ( obj['suffix']                || '' ) +
    ( obj['non-dropping-particle'] || '' ) +
    ( obj['family']                || '' )
  )||(obj['literal']               || '' ) )
}

/**
 * Object containing a list of Wikidata Instances and it's corresponding name as specified by the docs
 * 
 * @default
 */
var wikidataInstances = {
  Q13442814: 'article-journal'
, Q13442814: 'article-journal'
, Q191067  : 'article'
, Q3331189 : 'book'
, Q571     : 'book'
}

/**
 * Transform property and value from Wikidata format to CSL
 * 
 * @method wikidataProperties
 * 
 * @param a Property
 * @param b Value
 * @return Array with new prop and value
 */
var wikidataProperties = function(a,b){
  switch(b){
    case 'P31'  :
      return ['type',wikidataInstances['Q'+a[0].mainsnak.datavalue.value['numeric-id']]||
      (console.warn('[set]','This entry type is not recognized and therefore interpreted as \'article-journal\'')||'')+'article-journal'];
      break;
    case 'P212' : return ['ISBN'    ,a[0].mainsnak.datavalue.value]; break;
    case 'P304' : return ['page'    ,a[0].mainsnak.datavalue.value]; break;
    case 'P356' : return ['DOI'     ,a[0].mainsnak.datavalue.value]; break;
    case 'P393' : return ['edition' ,a[0].mainsnak.datavalue.value]; break;
    case 'P433' : return ['issue'   ,parseInt(a[0].mainsnak.datavalue.value)]; break;
    case 'P478' : return ['volume'  ,parseInt(a[0].mainsnak.datavalue.value)]; break;
    case 'P577' : return ['issued'  ,[a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-')]]; break;
    case 'P580' : return ['accessed',[a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-')]]; break;
    case 'P585' : return ['accessed',[a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-')]]; break;
    case 'P957' : return ['ISBN'    ,a[0].mainsnak.datavalue.value]; break;
    case 'P1476': return ['title'   ,typeof a[0].mainsnak.datavalue.value==='object'?a[0].mainsnak.datavalue.value.text:a[0].mainsnak.datavalue.value]; break;
    case 'P2093':
      var res = [];
      for (var i=0;i<a.length;i++) res.push(getCSLName(a[i].mainsnak.datavalue.value))
      return ['author',res];
      break;
    default: return [b,a]; break;
  }
}

/**
 * Fetch file
 * 
 * @method getFile
 * 
 * @param url The input string
 * @return The fetched string
 */
var getFile = function ( url ) {
  var result
  
  try {
      
    if ( browserMode ) {
    
      var xmlHttp = new XMLHttpRequest();
    
      xmlHttp.open( 'GET', url, false )
      xmlHttp.send( null )
      
      result = xmlHttp.responseText
      
    } else if ( nodejsMode ) {
      
      var request = require( 'sync-request' )
	  result  = request( 'GET', url ).getBody( 'utf8' )
      
    }
    
  } catch (e) {
    return console.error( '[set]', 'File could not be fetched')
  }
  
  if ( result === url )
    return console.error( '[set]', 'Infinite chaining loop detected')
  
  else
    return result
}

/**
 * Parse (in)valid JSON
 * 
 * @method getJSON
 * 
 * @param str The input string
 * @return The parsed object
 */
var getJSON = function ( str ) {
  var object
  try {
    object = JSON.parse( str )
  } catch (e) {
    (console.info||console.warn)( '[set]', 'Input was not valid JSON, switching to experimental parser for invalid JSON')
    try {
      object = JSON.parse(
	str
	  .replace(rgx.json[0][0],rgx.json[0][1])
	  .replace(rgx.json[1][0],rgx.json[1][1])
      )
    } catch (e) {
      console.error( '[set]', 'Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.')
    }
  }
  return object
}

/**
 * Format BibTeX data
 * 
 * @method parseBibTeX
 * 
 * @param str The input data
 * @return The formatted input data
 */
var parseBibTeX = function ( str ) {
  var str     = str || ''
    , entries = str.split( rgx.bibtex[ 0 ] )
  
  for ( var entryIndex = 0; entryIndex < entries.length; entryIndex++ ) {
    var entry = entries[ entryIndex ] + ( entryIndex + 1 < entries.length ? '}' : '' )
      , match = entry.match( rgx.bibtex[ 1 ] )
      , res   = { type:match[ 1 ], id:match[ 2 ], properties: {} }
      , pairs = match[ 3 ].split(rgx.bibtex[ 2 ])
    
    for ( var i = 0; i < pairs.length; i++ ) {
      var pair= pairs[i].split('=')
	, key = (pair[0]||'').trim(/\s/g)
	, val = (pair[1]||'').replace( rgx.bibtex[ 3 ][ 0 ], rgx.bibtex[ 3 ][ 1 ] ).replace(/\s+/g,' ');
      
      if ( key.length )
	res.properties[ key ] = val;
    }
    
    entries[ entryIndex ] = res
  }
  
  return entries
}

/**
 * Format Wikidata data
 * 
 * @method parseWikidata
 * 
 * @param data The input data
 * @return The formatted input data
 */
var parseWikidata = function ( data ) {
  var qid = Object.keys(data.entities)[0]
    , obj = data.entities[ qid ].claims
    , res = { id: qid };
  
  for (var prop in obj) {
    var val = wikidataProperties(obj[prop],prop)
    if (prop) res[val[0]]=val[1]; else continue;
  }
  
  res.title = res.title || data.entities[ Object.keys( data.entities )[ 0 ] ].labels.en.value;
  
  return res
}

/**
 * Format ContentMine data
 * 
 * @method parseContentMine
 * 
 * @param data The input data
 * @return The formatted input data
 */
var parseContentMine = function ( data ) {
  var res = {}
  
  for ( var prop in data )
    res[ prop ] = data[ prop ].value[ 0 ]
  
  res.type  = 'article-journal';
  
  if ( res.hasOwnProperty( 'authors'   ) ) res.author = data.authors.value.map( getCSLName )
  if ( res.hasOwnProperty( 'firstpage' ) ) res['page-first']      = res.firstpage, res.page = res.firstpage
  if ( res.hasOwnProperty( 'date'      ) ) res.issued = res.date.split( '-' )
  if ( res.hasOwnProperty( 'year'      ) ) res.year   = res.year ; else
  if ( res.hasOwnProperty( 'issued'    ) ) res.year   = res.issued[ 0 ]
  if ( res.hasOwnProperty( 'journal'   ) ) res['container-title'] = res.journal
  if ( res.hasOwnProperty( 'doi'       ) ) res.id     = res.doi, res.DOI = res.doi
  
  return res
}

/**
 * Determine input type (internal use)
 * 
 * @method parseInputType
 * 
 * @param input The input data
 * @return The input type
 */
var parseInputType = function ( input ) {
  
  switch ( typeof input) {
    
    case 'string':
      
      // Empty
	    if ( input.length === 0 )
	return 'empty'
      
      // Wikidata URL
      else if ( rgx.wikidata[ 0 ].test( input ) )
	return 'url/wikidata'
      
      // BibTeX
      else if ( rgx.bibtex  [ 1 ].test( input ) )
	return 'string/bibtex'
      
      // JSON
      else if ( /^\s*(\{|\[)/.test( input ) )
	return 'string/json'
      
      // Else URL
      else if ( rgx.url.test( input ) )
	return 'url/else'
      
      // Else
      else
	return console.warn( '[set]', 'This format is not supported or recognised' ) || 'invalid'
      
    case 'object':
      
      // Empty
	    if ( input === null )
	return 'empty'
      
      // Array
      else if ( Array.isArray( input ) )
	return 'array'
      
      // jQuery
      else if ( window.jQuery && input instanceof jQuery )
	return 'jquery'
      
      // HTML
      else if ( window.HMTLElement && input instanceof HMTLElement)
	return 'html'
      
      // Wikidata
      else if ( input.hasOwnProperty( 'entities' ) )
	return 'wikidata'
      
      // ContentMine
      else if ( input.hasOwnProperty( 'fulltext_html' ) ||
		input.hasOwnProperty( 'fulltext_xml'  ) ||
		input.hasOwnProperty( 'fulltext_pdf'  ) )
	return 'contentmine'
      
      // Default
      else
	return 'json'
      
      break;
    
    case 'undefined':
      
      // Empty
      return 'empty'
      
      break;
      
    default:
      
      return console.warn( '[set]', 'This format is not supported or recognised' ) || 'invalid'
      
      break;
  }
}

/**
 * Standardise input (internal use)
 * 
 * @method parseInputData
 * 
 * @param input The input data
 * @param type The input type
 * @return The parsed input
 */
var parseInputData = function ( input, type ) {
  var output
  
  switch ( type ) {
    
    case 'url/wikidata':
      input  =
	'https://www.wikidata.org/wiki/Special:EntityData/'
	+ input.match( rgx.wikidata[ 1 ] )[ 1 ] +
	'.json';
      
      output = parseInput( getFile( input ) )
      break;
    
    case 'url/else':
      output = parseInput( getFile( input ) )
      break;
    
    case 'jquery':
      output = parseInput( data.val() || data.text() || data.html() )
      break;
    
    case 'html':
      output = parseInput( data.value || data.textContent )
      break;
    
    case 'string/json':
      output = parseInput( getJSON( input ) )
      break;
    
    case 'string/bibtex':
      var bibtex = parseBibTeX( input )
      
      for ( var entryIndex = 0; entryIndex < bibtex.length; entryIndex++ ) {
	var entry = bibtex[ entryIndex ]
	  , properties = Object.assign( {}, entry.properties )
	
	delete entry.properties
	
	  entry = Object.assign( {}, entry, properties )
	
	if ( entry.hasOwnProperty( 'author'   ) ) entry.author = entry.author.split( ' and ' ).map( getCSLName )
	if ( entry.hasOwnProperty( 'doi'      ) ) entry.DOI    = entry.doi
	if ( entry.hasOwnProperty( 'editor'   ) ) entry.editor = entry.editor.split( ' and ' ).map( getCSLName )
	if ( entry.hasOwnProperty( 'isbn'     ) ) entry.ISBN   = entry.isbn
	if ( entry.hasOwnProperty( 'issn'     ) ) entry.ISSN   = entry.issn
	if ( entry.hasOwnProperty( 'journal'  ) ) entry['container-title'] = entry.journal, entry.type = 'article-journal'
	if ( entry.hasOwnProperty( 'location' ) ) entry['publisher-place'] = entry.location
	if ( entry.hasOwnProperty( 'pages'    ) ) entry.page   = entry.pages.replace( '--', '-' )
	if ( entry.hasOwnProperty( 'title'    ) ) entry.title  = entry.title.replace(/\.$/g,'')
	
	bibtex[ entryIndex ] = entry
      }
      
      output = bibtex
      break;
    
    case 'wikidata':
      output = parseWikidata( input )
      break;
    
    case 'contentmine':
      output = parseContentMine( input )
      break;
    
    case 'array':
      output = []
      input.forEach( function ( value ) {
	output.concat( parseInput( value ) )
      } )
      break;
    
    case 'json':
      output = [ input ]
      break;
    
    case 'empty'  :
    case 'invalid':
    default       :
      output = []
      break;
    
  }
  
  return output
}

/**
 * Parse input (internal use). Wrapper for `parseInputType()` and `parseInputData()`
 * 
 * @method parseInput
 * 
 * @param input The input data
 * @return The parsed input
 */
var parseInput = function ( input ) {
  var type = parseInputType( input )
    , outp = parseInputData( input, type )
  
  return outp
}

/**
 * Convert a JSON array or object to HTML.
 * 
 * @function objectToHTML
 * @param {Object} src - The data
 * 
 * @return The html (in string form)
 */

var objectToHTML = function ( src ) {
  var res = ''
  
  if ( Array.isArray( src ) ) {
    
    res += '[<ul style="list-style-type:none">';
    
    for ( var entry of src ) {
      
      res += '<li>'
      res += JSONToHTML( entry )
      res += ',</li>'
      
    } 
    
    res += '</ul>]'
    
  } else if ( src !== null ) {
    
    res += '{<ul style="list-style-type:none">';
    
    for ( var prop in src ) {
      
      var entry = src[ prop ]
      
      res += '<li><span class="key">' + prop + '</span><span class="delimiter">:</span>'
      res += JSONToHTML( entry )
      res += ',</li>'
      
    }
    
    res += '</ul>}'
  }
  
  return res
}

/**
 * Convert JSON to HTML.
 * 
 * @function JSONToHTML
 * @param {Object} src - The data
 * 
 * @return The html (in string form)
 */
var JSONToHTML = function (src) {
  var res = ''
  
  if ( typeof src === 'object' && src !== null ) {
	
    if ( Object.keys( src ).length === 0 )
      res += '{}'
    else
      res += objectToHTML( src )
    
  } else res += '<span class="string">' + JSON.stringify( src ) + '</span>'
  
  return res
}

/**
 * @author Lars Willighagen [lars.willighagen@gmail.com]
 * @version 0.1
 * @license
 * Copyright (c) 2015-2016 Lars Willighagen
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
 * 
 * @class Cite
 * 
 * Create a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 * 
 * @param {(Object[]|Object|String)} data - Pass the data. If no data is passed, an empty object is returned
 * @param {Object} [options={}] - The options for the output
 * @param {String} options.format - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
 * @param {String} options.type - The format of the output. `"string"`, `"html"` or `"json"`
 * @param {String} options.style - The style of the output. See [Output](./#output)
 * @param {String} options.lang - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
 */

 function Cite (data,options) {

  // Making it Scope-Safe
  if ( !( this instanceof Cite ) )
    return new Cite( data, options )
  
  /**
   * The default options for the output
   * 
   * @property format {String} The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
   * @property type {String} The format of the output. `"string"`, `"html"` or `"json"`
   * @property style {String} The style of the output. See [Output](./#output)
   * @property lang {String} The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
   * @type Object
   * @default {}
   */
  this._options = options || {}
  
  /**
   * Information about the input data
   *
   * @property data The inputted data
   * @property type {String} The datatype of the input
   * @property format {String} The format of the input
   * @type Object
   */
  this._input = {
    data: data
  , type: typeof data
  , format: parseInputType( data )
  }
  
  /**
   * The data formatted to JSON
   *
   * @type Object
   * @default []
   */
  this.data = []
  
  /**
   * The log, containing all logged data.
   * 
   * These are the names of each called function, together with it's input. If the `Cite` object is changed, the version number gets updated as well.
   * 
   * The `.reset()` function **does not** have any influence on the log. This way, you can still undo all changes.
   * 
   * <br /><br />
   * `.currentVersion()` and similar function **are not** logged, because this would be influenced by function using other functions.
   *
   * @type Object[]
   * @property {Object} 0 - The first version, indicated with version 0, containing the object as it was when it was made. The following properties are used for the following properties too.
   * @property {String} 0.name - The name of the called function. In case of the initial version, this is `"init"`.
   * @property {String} 0.version - The version of the object. Undefined when a function that doesn't change the object is called.
   * @property {Array} 0.arguments - The arguments passed in the called function.
   */
  this._log = [
    {name:'init',version:'0',arguments:[this._input.data,this._options]}
  ]
  
  // Public methods
  
  /**
   * 
   * @method getLabel
   * @memberof Cite
   * @this Cite
   * 
   * @param index data index
   * @return The label
   */
  this.getLabel = function ( index ) {
    var src = this.data[ index ]
    
    return ( ''
    + ( src.author ? src.author[ 0 ].family : '' )
    + ( src.year   ? src.year : ( src.issued && !(src.issued[0].raw) ? src.issued[ 0 ][ 0 ] : '' ) )
    + ( src.title  ? src.title.replace(/^(the|a|an)/i,'').split(' ')[0] : '' )
    )
  }
  
  /**
   * 
   * @method currentVersion
   * @memberof Cite
   * @this Cite
   * 
   * @return The latest version of the object
   */
  this.currentVersion = function(){
    var version = 0;
    for(i=0;i<this._log.length;i++){if(this._log[i].version>version)version=this._log[i].version}
    return version;
  }
  
  /**
   * Does not change the current object.
   * 
   * @method retrieveVersion
   * @memberof Cite
   * @this Cite
   * 
   * @param {Integer} The number of the version you want to retrieve. Illegel numbers: numbers under zero, floats, numbers above the current version of the object.
   * @return The version of the object with the version number passed. `undefined` if an illegal number is passed.
   */
  this.retrieveVersion = function(versnum){
    this._log.push({name:'retrieveVersion',arguments:[versnum]});
    if (versnum>=0&&versnum<=this.currentVersion()) {
      var object=new Cite(this._log[0].arguments[0],this._log[0].arguments[1]),
	  arr=[];
      for(i=0;i<this._log.length;i++){if(this._log[i].version)arr.push(this._log[i]);}
      for(k=1;k<=versnum;k++){ object[arr[k].name].apply(object,(arr[k].arguments||[])); }
      return object;
    } else return undefined;
  }
  
  /**
   * Does not change the current object. Undoes the last edit made.
   * 
   * @method undo
   * @memberof Cite
   * @this Cite
   * 
   * @return The last version of the object. `undefined` if used on first version.
   */
  this.undo = function(){
    return this.retrieveVersion(this.currentVersion()-1);
  }
  
  /**
  * Add an object to the array of objects
  * 
  * @method add
  * @memberof Cite
  * @this Cite
  * 
  * @param data The data to add to your object
  * @return The updated parent object
  */
  this.add = function ( data, nolog ) {
    if ( !nolog )
      this._log.push( { name: 'add', version: this.currentVersion() + 1, arguments: [ data, nolog ] } )
    
    var input = parseInput( data );
    
    this.data = this.data.concat( input )
    
    return this
  }
  
  /**
   * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
   * 
   * @method set
   * @memberof Cite
   * @this Cite
   * 
   * @param data The data to replace the data in your object
   * @return The updated parent object
   */
  this.set = function ( data, nolog ) {
    if ( !nolog )
      this._log.push( { name: 'set', version: this.currentVersion() + 1, arguments: [ data, nolog ] } )
    
    this.data = []
    this.add( data, true )
    
    return this
  }
  
  /**
   * Change the default options of a `Cite` object.
   * 
   * @method options
   * @memberof Cite
   * @this Cite
   * 
  * @param {Object} [options={}] - The options for the output
  * @param {String} options.format - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
  * @param {String} options.type - The format of the output. `"string"`, `"html"` or `"json"`
  * @param {String} options.style - The style of the output. See [Output](./#output)
  * @param {String} options.lang - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
   * @return The updated parent object
   */
  this.options = function ( options, nolog ) {
    if ( !nolog )
      this._log.push( { name: 'options', version: this.currentVersion() + 1, arguments: [ options ] } )
    
    Object.assign( this._options, options )
    
    return this
  }
  
  /**
   * Reset a `Cite` object.
   * 
   * @method reset
   * @memberof Cite
   * @this Cite
   * @return The updated, empty parent object (except the log, the log lives)
   */
  this.reset = function () {
    this._log.push( { name: 'reset', version: this.currentVersion() + 1, arguments: [] } )
    
    this.data     = []
    this._options = {}
    
    return this
  }
  
  /**
   * Sort the datasets alphabetically, on basis of it's BibTeX label
   * 
   * @method sort
   * @memberof Cite
   * @this Cite
   * 
   * @return The updated parent object
   */
  this.sort = function () {
    this._log.push( { name: 'sort', version: this.currentVersion() + 1, arguments: [] } )
    
    this.data.sort( function ( a, b ) {
      var labela = this.getLabel( this.data.indexOf( a ) )
	, labelb = this.getLabel( this.data.indexOf( b ) )
      
      return labela != labelb ?
	( labela > labelb ? 1 : -1 )
      : 0 ;
    } )
    
    return this
  }
  
  /**
  * Get formatted data from your object. For more info, see [Output](./#output).
  * 
  * @method get
  * @memberof Cite
  * @this Cite
  * 
  * @param {Object} [options={}] - The options for the output
  * @param {String} [options.format="real"] - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
  * @param {String} [options.type="json"] - The format of the output. `"string"`, `"html"` or `"json"`
  * @param {String} [options.style="csl"] - The style of the output. See [Output](./#output)
  * @param {String} [options.lang="en"] - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
  * @return The formatted data
  */
  this.get = function ( options, nolog ) {
    if( !nolog )
      this._log.push( { name: 'get', arguments: [ options ] } )
    
    var result
      , options = Object.assign( { format:'real',type:'json',style:'csl',lang:'en-US' }, this._options, options )
    
    try { console.info( '[get]',`format: ${options.format} | type: ${options.type} | style: ${options.style} | language: ${options.lang}` )
    } catch (e) {
      // Oh well...
    }
    
    switch ( options.type.toLowerCase() ) {
      case 'html':
	
	switch ( options.style.toLowerCase().split( '-' )[ 0 ] ) {
	  case 'citation':
	    var _data = this.data
	    
	    /**
	     * 
	     */
	    var retrieveLocale = function ( lang ) {
	      return '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="en-US"><info><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights><updated>2015-10-10T23:31:02+00:00</updated></info><style-options punctuation-in-quote="true"/><date form="text"><date-part name="month" suffix=" "/><date-part name="day" suffix=", "/><date-part name="year"/></date><date form="numeric"><date-part name="month" form="numeric-leading-zeros" suffix="/"/><date-part name="day" form="numeric-leading-zeros" suffix="/"/><date-part name="year"/></date><terms><term name="accessed">accessed</term><term name="and">and</term><term name="and others">and others</term><term name="anonymous">anonymous</term><term name="anonymous" form="short">anon.</term><term name="at">at</term><term name="available at">available at</term><term name="by">by</term><term name="circa">circa</term><term name="circa" form="short">c.</term><term name="cited">cited</term><term name="edition"><single>edition</single><multiple>editions</multiple></term><term name="edition" form="short">ed.</term><term name="et-al">et al.</term><term name="forthcoming">forthcoming</term><term name="from">from</term><term name="ibid">ibid.</term><term name="in">in</term><term name="in press">in press</term><term name="internet">internet</term><term name="interview">interview</term><term name="letter">letter</term><term name="no date">no date</term><term name="no date" form="short">n.d.</term><term name="online">online</term><term name="presented at">presented at the</term><term name="reference"><single>reference</single><multiple>references</multiple></term><term name="reference" form="short"><single>ref.</single><multiple>refs.</multiple></term><term name="retrieved">retrieved</term><term name="scale">scale</term><term name="version">version</term><term name="ad">AD</term><term name="bc">BC</term><term name="open-quote">“</term><term name="close-quote">”</term><term name="open-inner-quote">‘</term><term name="close-inner-quote">’</term><term name="page-range-delimiter">–</term><term name="ordinal">th</term><term name="ordinal-01">st</term><term name="ordinal-02">nd</term><term name="ordinal-03">rd</term><term name="ordinal-11">th</term><term name="ordinal-12">th</term><term name="ordinal-13">th</term><term name="long-ordinal-01">first</term><term name="long-ordinal-02">second</term><term name="long-ordinal-03">third</term><term name="long-ordinal-04">fourth</term><term name="long-ordinal-05">fifth</term><term name="long-ordinal-06">sixth</term><term name="long-ordinal-07">seventh</term><term name="long-ordinal-08">eighth</term><term name="long-ordinal-09">ninth</term><term name="long-ordinal-10">tenth</term><term name="book"><single>book</single><multiple>books</multiple></term><term name="chapter"><single>chapter</single><multiple>chapters</multiple></term><term name="column"><single>column</single><multiple>columns</multiple></term><term name="figure"><single>figure</single><multiple>figures</multiple></term><term name="folio"><single>folio</single><multiple>folios</multiple></term><term name="issue"><single>number</single><multiple>numbers</multiple></term><term name="line"><single>line</single><multiple>lines</multiple></term><term name="note"><single>note</single><multiple>notes</multiple></term><term name="opus"><single>opus</single><multiple>opera</multiple></term><term name="page"><single>page</single><multiple>pages</multiple></term><term name="number-of-pages"><single>page</single><multiple>pages</multiple></term><term name="paragraph"><single>paragraph</single><multiple>paragraphs</multiple></term><term name="part"><single>part</single><multiple>parts</multiple></term><term name="section"><single>section</single><multiple>sections</multiple></term><term name="sub verbo"><single>sub verbo</single><multiple>sub verbis</multiple></term><term name="verse"><single>verse</single><multiple>verses</multiple>'+
'</term><term name="volume"><single>volume</single><multiple>volumes</multiple></term><term name="book" form="short"><single>bk.</single><multiple>bks.</multiple></term><term name="chapter" form="short"><single>chap.</single><multiple>chaps.</multiple></term><term name="column" form="short"><single>col.</single><multiple>cols.</multiple></term><term name="figure" form="short"><single>fig.</single><multiple>figs.</multiple></term><term name="folio" form="short"><single>fol.</single><multiple>fols.</multiple></term><term name="issue" form="short"><single>no.</single><multiple>nos.</multiple></term><term name="line" form="short"><single>l.</single><multiple>ll.</multiple></term><term name="note" form="short"><single>n.</single><multiple>nn.</multiple></term><term name="opus" form="short"><single>op.</single><multiple>opp.</multiple></term><term name="page" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="number-of-pages" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="paragraph" form="short"><single>para.</single><multiple>paras.</multiple></term><term name="part" form="short"><single>pt.</single><multiple>pts.</multiple></term><term name="section" form="short"><single>sec.</single><multiple>secs.</multiple></term><term name="sub verbo" form="short"><single>s.v.</single><multiple>s.vv.</multiple></term><term name="verse" form="short"><single>v.</single><multiple>vv.</multiple></term><term name="volume" form="short"><single>vol.</single><multiple>vols.</multiple></term><term name="paragraph" form="symbol"><single>¶</single><multiple>¶¶</multiple></term><term name="section" form="symbol"><single>§</single><multiple>§§</multiple></term><term name="director"><single>director</single><multiple>directors</multiple></term><term name="editor"><single>editor</single><multiple>editors</multiple></term><term name="editorial-director"><single>editor</single><multiple>editors</multiple></term><term name="illustrator"><single>illustrator</single><multiple>illustrators</multiple></term><term name="translator"><single>translator</single><multiple>translators</multiple></term><term name="editortranslator"><single>editor &amp; translator</single><multiple>editors &amp; translators</multiple></term><term name="director" form="short"><single>dir.</single><multiple>dirs.</multiple></term><term name="editor" form="short"><single>ed.</single><multiple>eds.</multiple></term><term name="editorial-director" form="short"><single>ed.</single><multiple>eds.</multiple></term><term name="illustrator" form="short"><single>ill.</single><multiple>ills.</multiple></term><term name="translator" form="short"><single>tran.</single><multiple>trans.</multiple></term><term name="editortranslator" form="short"><single>ed. &amp; tran.</single><multiple>eds. &amp; trans.</multiple></term><term name="container-author" form="verb">by</term><term name="director" form="verb">directed by</term><term name="editor" form="verb">edited by</term><term name="editorial-director" form="verb">edited by</term><term name="illustrator" form="verb">illustrated by</term><term name="interviewer" form="verb">interview by</term><term name="recipient" form="verb">to</term><term name="reviewed-author" form="verb">by</term><term name="translator" form="verb">translated by</term><term name="editortranslator" form="verb">edited &amp; translated by</term><term name="director" form="verb-short">dir. by</term><term name="editor" form="verb-short">ed. by</term><term name="editorial-director" form="verb-short">ed. by</term><term name="illustrator" form="verb-short">illus. by</term><term name="translator" form="verb-short">trans. by</term><term name="editortranslator" form="verb-short">ed. &amp; trans. by</term><term name="month-01">January</term><term name="month-02">February</term><term name="month-03">March</term><term name="month-04">April</term><term name="month-05">May</term><term name="month-06">June</term><term name="month-07">July</term><term name="month-08">August</term><term name="month-09">September</term>'+
'<term name="month-10">October</term><term name="month-11">November</term><term name="month-12">December</term><term name="month-01" form="short">Jan.</term><term name="month-02" form="short">Feb.</term><term name="month-03" form="short">Mar.</term><term name="month-04" form="short">Apr.</term><term name="month-05" form="short">May</term><term name="month-06" form="short">Jun.</term><term name="month-07" form="short">Jul.</term><term name="month-08" form="short">Aug.</term><term name="month-09" form="short">Sep.</term><term name="month-10" form="short">Oct.</term><term name="month-11" form="short">Nov.</term><term name="month-12" form="short">Dec.</term><term name="season-01">Spring</term><term name="season-02">Summer</term><term name="season-03">Autumn</term><term name="season-04">Winter</term></terms></locale>'
	    }
	    
	    /**
	     * 
	     */
	    var retrieveItem = function ( id ) {
	      for ( var entryIndex = 0; entryIndex < _data.length; entryIndex++ ) {
 		var entry = _data[ entryIndex ]
		if ( entry.id === id )
		  return entry
	      }
	      if ( parseInt( id ) + 1 )
		return _data[ id ]
	    }
    
	    var style = options.style.toLowerCase().split( '-' )[ 1 ]
	      , citeproc= new CSL.Engine(
	      { retrieveLocale: retrieveLocale, retrieveItem: retrieveItem }
	      ,'<?xml version="1.0" encoding="utf-8"?><style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="never"><info><title>American Psychological Association 6th edition</title><title-short>APA</title-short><id>http://www.zotero.org/styles/apa</id><link href="http://www.zotero.org/styles/apa" rel="self"/><link href="http://owl.english.purdue.edu/owl/resource/560/01/" rel="documentation"/><author><name>Simon Kornblith</name><email>simon@simonster.com</email></author><contributor><name>Bruce D\'Arcus</name></contributor><contributor><name>Curtis M. Humphrey</name></contributor><contributor><name>Richard Karnesky</name><email>karnesky+zotero@gmail.com</email><uri>http://arc.nucapt.northwestern.edu/Richard_Karnesky</uri></contributor><contributor><name>Sebastian Karcher</name></contributor><contributor><name> Brenton M. Wiernik</name><email>zotero@wiernik.org</email></contributor><category citation-format="author-date"/><category field="psychology"/><category field="generic-base"/><updated>2016-05-25T09:01:49+00:00</updated><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights></info><locale xml:lang="en"><terms><term name="editortranslator" form="short"><single>ed. &amp; trans.</single><multiple>eds. &amp; trans.</multiple></term><term name="translator" form="short"><single>trans.</single><multiple>trans.</multiple></term></terms></locale><macro name="container-contributors"><choose><if type="chapter paper-conference entry-dictionary entry-encyclopedia" match="any"><group delimiter=", "><names variable="container-author" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=" (" text-case="title" suffix=")"/></names><names variable="editor translator" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=" (" text-case="title" suffix=")"/></names></group></if></choose></macro><macro name="secondary-contributors"><choose><if type="article-journal chapter paper-conference entry-dictionary entry-encyclopedia" match="none"><group delimiter=", " prefix=" (" suffix=")"><names variable="container-author" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=", " text-case="title"/></names><names variable="editor translator" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=", " text-case="title"/></names></group></if></choose></macro><macro name="author"><names variable="author"><name name-as-sort-order="all" and="symbol" sort-separator=", " initialize-with=". " delimiter=", " delimiter-precedes-last="always"/><label form="short" prefix=" (" suffix=")" text-case="capitalize-first"/><substitute><names variable="editor"/><names variable="translator"/><choose><if type="report"><text variable="publisher"/><text macro="title"/></if><else><text macro="title"/></else></choose></substitute></names></macro><macro name="author-short"><names variable="author"><name form="short" and="symbol" delimiter=", " initialize-with=". "/><substitute><names variable="editor"/><names variable="translator"/><choose><if type="report"><text variable="publisher"/><text variable="title" form="short" font-style="italic"/></if><else-if type="legal_case"><text variable="title" font-style="italic"/></else-if><else-if type="bill book graphic legislation motion_picture song" match="any"><text variable="title" form="short" font-style="italic"/></else-if><else-if variable="reviewed-author"><choose><if variable="reviewed-title" match="none"><text variable="title" form="short" font-style="italic" prefix="Review of "/></if><else><text variable="title" form="short" quotes="true"/></else></choose></else-if><else><text variable="title" form="short" quotes="true"/></else></choose></substitute></names></macro><macro name="access"><choose><if type="thesis report" match="any"><choose><if variable="DOI" match="any">'+
'<text variable="DOI" prefix="https://doi.org/"/></if><else-if variable="archive" match="any"><group><text term="retrieved" text-case="capitalize-first" suffix=" "/><text term="from" suffix=" "/><text variable="archive" suffix="."/><text variable="archive_location" prefix=" (" suffix=")"/></group></else-if><else><group><text term="retrieved" text-case="capitalize-first" suffix=" "/><text term="from" suffix=" "/><text variable="URL"/></group></else></choose></if><else><choose><if variable="DOI"><text variable="DOI" prefix="https://doi.org/"/></if><else><choose><if type="webpage"><group delimiter=" "><text term="retrieved" text-case="capitalize-first" suffix=" "/><group><date variable="accessed" form="text" suffix=", "/></group><text term="from"/><text variable="URL"/></group></if><else><group><text term="retrieved" text-case="capitalize-first" suffix=" "/><text term="from" suffix=" "/><text variable="URL"/></group></else></choose></else></choose></else></choose></macro><macro name="title"><choose><if type="book graphic manuscript motion_picture report song speech thesis" match="any"><choose><if variable="version" type="book" match="all"><text variable="title"/></if><else><text variable="title" font-style="italic"/></else></choose></if><else-if variable="reviewed-author"><choose><if variable="reviewed-title"><group delimiter=" "><text variable="title"/><group delimiter=", " prefix="[" suffix="]"><text variable="reviewed-title" font-style="italic" prefix="Review of "/><names variable="reviewed-author" delimiter=", "><label form="verb-short" suffix=" "/><name and="symbol" initialize-with=". " delimiter=", "/></names></group></group></if><else><group delimiter=", " prefix="[" suffix="]"><text variable="title" font-style="italic" prefix="Review of "/><names variable="reviewed-author" delimiter=", "><label form="verb-short" suffix=" "/><name and="symbol" initialize-with=". " delimiter=", "/></names></group></else></choose></else-if><else><text variable="title"/></else></choose></macro><macro name="title-plus-extra"><text macro="title"/><choose><if type="report thesis" match="any"><group prefix=" (" suffix=")" delimiter=", "><group delimiter=" "><choose><if variable="genre" match="any"><text variable="genre"/></if><else><text variable="collection-title"/></else></choose><text variable="number" prefix="No. "/></group><group delimiter=" "><text term="version" text-case="capitalize-first"/><text variable="version"/></group><text macro="edition"/></group></if><else-if type="post-weblog webpage" match="any"><text variable="genre" prefix=" [" suffix="]"/></else-if><else-if variable="version"><group delimiter=" " prefix=" (" suffix=")"><text term="version" text-case="capitalize-first"/><text variable="version"/></group></else-if></choose><text macro="format" prefix=" [" suffix="]"/></macro><macro name="format"><choose><if match="any" variable="medium"><text variable="medium" text-case="capitalize-first"/></if><else-if type="dataset" match="any"><text value="Data set"/></else-if></choose></macro><macro name="publisher"><choose><if type="report" match="any"><group delimiter=": "><text variable="publisher-place"/><text variable="publisher"/></group></if><else-if type="thesis" match="any"><group delimiter=", "><text variable="publisher"/><text variable="publisher-place"/></group></else-if><else-if type="post-weblog webpage" match="none"><group delimiter=", "><choose><if variable="event version" type="speech motion_picture" match="none"><text variable="genre"/></if></choose><choose><if type="article-journal article-magazine" match="none"><group delimiter=": "><choose><if variable="publisher-place"><text variable="publisher-place"/></if><else><text variable="event-place"/></else></choose><text variable="publisher"/></group></if></choose></group></else-if></choose></macro><macro name="event"><choose><if variable="container-title" match="none"><choose><if variable="event"><choose><if variable="genre" match="none"><text term="presented at" text-case="capitalize-first" suffix=" "/><text variable="event"/></if><else>'+
'<group delimiter=" "><text variable="genre" text-case="capitalize-first"/><text term="presented at"/><text variable="event"/></group></else></choose></if><else-if type="speech"><text variable="genre" text-case="capitalize-first"/></else-if></choose></if></choose></macro><macro name="issued"><choose><if type="bill legal_case legislation" match="none"><choose><if variable="issued"><group prefix=" (" suffix=")"><date variable="issued"><date-part name="year"/></date><text variable="year-suffix"/><choose><if type="speech" match="any"><date variable="issued"><date-part prefix=", " name="month"/></date></if><else-if type="article-journal bill book chapter graphic legal_case legislation motion_picture paper-conference report song dataset" match="none"><date variable="issued"><date-part prefix=", " name="month"/><date-part prefix=" " name="day"/></date></else-if></choose></group></if><else-if variable="status"><group prefix=" (" suffix=")"><text variable="status"/><text variable="year-suffix" prefix="-"/></group></else-if><else><group prefix=" (" suffix=")"><text term="no date" form="short"/><text variable="year-suffix" prefix="-"/></group></else></choose></if></choose></macro><macro name="issued-sort"><choose><if type="article-journal bill book chapter graphic legal_case legislation motion_picture paper-conference report song dataset" match="none"><date variable="issued"><date-part name="year"/><date-part name="month"/><date-part name="day"/></date></if><else><date variable="issued"><date-part name="year"/></date></else></choose></macro><macro name="issued-year"><choose><if variable="issued"><group delimiter="/"><date variable="original-date" form="text"/><group><date variable="issued"><date-part name="year"/></date><text variable="year-suffix"/></group></group></if><else-if variable="status"><text variable="status"/><text variable="year-suffix" prefix="-"/></else-if><else><text term="no date" form="short"/><text variable="year-suffix" prefix="-"/></else></choose></macro><macro name="edition"><choose><if is-numeric="edition"><group delimiter=" "><number variable="edition" form="ordinal"/><text term="edition" form="short"/></group></if><else><text variable="edition"/></else></choose></macro><macro name="locators"><choose><if type="article-journal article-magazine" match="any"><group prefix=", " delimiter=", "><group><text variable="volume" font-style="italic"/><text variable="issue" prefix="(" suffix=")"/></group><text variable="page"/></group><choose><if variable="issued"><choose><if variable="page issue" match="none"><text variable="status" prefix=". "/></if></choose></if></choose></if><else-if type="article-newspaper"><group delimiter=" " prefix=", "><label variable="page" form="short"/><text variable="page"/></group></else-if><else-if type="book graphic motion_picture report song chapter paper-conference entry-encyclopedia entry-dictionary" match="any"><group prefix=" (" suffix=")" delimiter=", "><choose><if type="report" match="none"><text macro="edition"/></if></choose><choose><if variable="volume" match="any"><group><text term="volume" form="short" text-case="capitalize-first" suffix=" "/><number variable="volume" form="numeric"/></group></if><else><group><text term="volume" form="short" plural="true" text-case="capitalize-first" suffix=" "/><number variable="number-of-volumes" form="numeric" prefix="1&#8211;"/></group></else></choose><group><label variable="page" form="short" suffix=" "/><text variable="page"/></group></group></else-if><else-if type="legal_case"><group prefix=" (" suffix=")" delimiter=" "><text variable="authority"/><date variable="issued" form="text"/></group></else-if><else-if type="bill legislation" match="any"><date variable="issued" prefix=" (" suffix=")"><date-part name="year"/></date></else-if></choose></macro><macro name="citation-locator"><group><choose><if locator="chapter"><label variable="locator" form="long" text-case="capitalize-first"/></if><else><label variable="locator" form="short"/></else></choose><text variable="locator" prefix=" "/></group></macro>'+
'<macro name="container"><choose><if type="post-weblog webpage" match="none"><group><choose><if type="chapter paper-conference entry-encyclopedia" match="any"><text term="in" text-case="capitalize-first" suffix=" "/></if></choose><group delimiter=", "><text macro="container-contributors"/><text macro="secondary-contributors"/><text macro="container-title"/></group></group></if></choose></macro><macro name="container-title"><choose><if type="article article-journal article-magazine article-newspaper" match="any"><text variable="container-title" font-style="italic" text-case="title"/></if><else-if type="bill legal_case legislation" match="none"><text variable="container-title" font-style="italic"/></else-if></choose></macro><macro name="legal-cites"><choose><if type="bill legal_case legislation" match="any"><group delimiter=" " prefix=", "><choose><if variable="container-title"><text variable="volume"/><text variable="container-title"/><group delimiter=" "><text term="section" form="symbol"/><text variable="section"/></group><text variable="page"/></if><else><choose><if type="legal_case"><text variable="number" prefix="No. "/></if><else><text variable="number" prefix="Pub. L. No. "/><group delimiter=" "><text term="section" form="symbol"/><text variable="section"/></group></else></choose></else></choose></group></if></choose></macro><macro name="original-date"><choose><if variable="original-date"><group prefix="(" suffix=")" delimiter=" "><text value="Original work published"/><date variable="original-date" form="text"/></group></if></choose></macro><citation et-al-min="6" et-al-use-first="1" et-al-subsequent-min="3" et-al-subsequent-use-first="1" disambiguate-add-year-suffix="true" disambiguate-add-names="true" disambiguate-add-givenname="true" collapse="year" givenname-disambiguation-rule="primary-name"><sort><key macro="author"/><key macro="issued-sort"/></sort><layout prefix="(" suffix=")" delimiter="; "><group delimiter=", "><text macro="author-short"/><text macro="issued-year"/><text macro="citation-locator"/></group></layout></citation><bibliography hanging-indent="true" et-al-min="8" et-al-use-first="6" et-al-use-last="true" entry-spacing="0" line-spacing="2"><sort><key macro="author"/><key macro="issued-sort" sort="ascending"/><key macro="title"/></sort><layout><group suffix="."><group delimiter=". "><text macro="author"/><text macro="issued"/><text macro="title-plus-extra"/><text macro="container"/></group><text macro="legal-cites"/><text macro="locators"/><group delimiter=", " prefix=". "><text macro="event"/><text macro="publisher"/></group></group><text macro="access" prefix=" "/><text macro="original-date" prefix=" "/></layout></bibliography></style>'
	      ,'en-US'
	      , true
	    )
	      , itemIDs = []
	    
	    for ( var entryIndex = 0; entryIndex < this.data.length; entryIndex++ ) {
	      var entry = this.data[ entryIndex ]
	      if ( entry.hasOwnProperty( 'id' ) )
		itemIDs.push( entry.id )
	      else
		entry.id = itemIDs.push( entryIndex )
	    }
	    
	    citeproc.updateItems(itemIDs)
	    
	    var bib = citeproc.makeBibliography()
	    
	    console.debug( style )
	    
	    result = (
	      bib[0].bibstart +
	      bib[1].join() +
	      bib[0].bibend
	    )
	    
	    break;
	  
	  case 'csl':
	    
	    result = '<div class="javascript">' + JSONToHTML( this.data ) + '</div>'
	    
	    break;
	  
	  case 'bibtex':
	    
	    result = ''
	    
	    for ( var i = 0; i < this.data.length; i++ ) {
	      
	      var src = this.data[ i ]
	        , pubType = (src.type||'').toLowerCase()
	    
	      result += '<ul style="list-style-type:none"><li>@';
		    
	      switch(pubType){
		case 'book':
		  
		  result += 'book';
		  break;
		  
		case 'article-journal':
		case 'article-newspaper':
		case 'article':
		  
		  result += 'article';
		  break;
		  
		default:
		  
		  result += 'misc';
		  break;
	      }
	      
	      result += '{';
	      result += this.getLabel( i )
	      result += ',<ul style="list-style-type:none">';
	      
	      var obj = {}
		, arr
	      
	      if ( src.author    ) obj.author    = src.author.slice().map(getName).join(' and ')
	      if ( src.event     ) obj.organization = src.event
	      if ( src.date      ) obj.note      = '[Online; accesed ' + date( src.date , 'bx' ) + ']'
	      if ( src.DOI       ) obj.doi       = src.DOI
	      if ( src.editor    ) obj.editor    = src.editor.slice().map(getName).join(' and ')
	      if ( src.ISBN      ) obj.isbn      = src.ISBN
	      if ( src.ISSN      ) obj.issn      = src.ISSN
	      if ( src['container-title'] )
		                   obj.journal   = src['container-title']
	      if ( src.issue     ) obj.issue     = src.issue
	      if ( src.page      ) obj.pages     = src.page.replace('-','--')
	      if ( src['publisher-place'] )
		                   obj.address   = ( Array.isArray(src.place) ? src.place[0] : src.place )
	      if ( src.edition   ) obj.edition   = src.edition
	      if ( src.publisher ) obj.publisher = src.publisher
	      if ( src.title     ) obj.title     = '{' + src.title + '}'
	      if ( src.url       ) obj.url       = src.url
	      if ( src.volume    ) obj.volume    = src.volume
	      if ( src.year      ) obj.year      = src.year
		    else if ( (src.issued[0]).length === 3 )
				   obj.year      = src.issued[ 0 ][ 2 ]
	      
	      arr  = Object.keys( obj )
	      
	      for ( var propIndex = 0; propIndex < arr.length; propIndex++ ) {
		var prop = arr[ propIndex ]
		  , val  = obj[ prop      ]
		
		arr[ propIndex ] = prop + '={' + val + '}'
	      }
	      
	      result += '<li>'+arr.join(',</li><li>')+'</li>';
	      result += '</ul>}</li></ul>';
	      
	    }
	    
	    break;
	}
	
        break;
      
      case 'string':
	
	var options = Object.assign( {format:'html'}, options )
	
	console.log(options)
	
	var html = $.parseHTML( this.get( options, true ) )
	
	result = html[ 0 ].textContent
	
	break;
      
      case 'json':
	
	switch ( options.style.toLowerCase().split( '-' )[ 0 ] ) {
	  case 'csl':
	    
	    result = JSON.stringify( this.data )
	    
	    break;
	  
	  case 'bibtex':
	    
	    var obj   = {}
	      , props = JSON.parse( JSON.stringify( this.data ) )
	    
	    obj.label = props.id
	    delete props.id
	    
	    obj.type  = props.type
	    delete props.type
	    
	    obj.properties = props
	    
	    result = JSON.stringify( obj )
	    
	    break;
	  
	  case 'citation':
	    
	    result = console.error( '[get]', `Combination type/style of json/citation-* is not valid: ${options.type}/${options.style}` )//
	    
	    break;
	}
	
	break;
    }
    
    return result
  }
  
  this.set( data, true )
  this.options( options, true )
  
}

/*module.exports =
scope.Cite     = Cite*/
window.Cite = Cite

})(/*
  ( typeof window   !== 'undefined' ? window : {} )
, ( typeof module   !== 'undefined' ? module : {} )
, ( typeof process  !== 'undefined' && typeof global   !== 'undefined' )
, ( typeof location !== 'undefined' && typeof document !== 'undefined' )
*/)