/** 
 * @file Citation-0.1.js
 * @todo Add jQuery plugin (building forms)
 * 
 * @description
 * # Description
 *
 * Citation.js converts formats like BibTeX, Wikidata JSON and ContentMine JSON to a custom standard to convert to other formats like APA, Vancouver and back to BibTeX.
 *
 * # Use
 *
 * Use the object constructor `Cite()` with the parameters as listed [below](#input). Then just call one of the functions, e.g. `.get()`, to get your [output](#output).
 *
 * <a name="input">
 * ## Input
 * </a>
 *
 * **When making the `Cite()` object:**
 *
 * 1. In the first parameter you pass the string, object or array of objects you want to convert. For the properties supported in the objects, see [JSON](#json).
 * 2. In the second parameter you pass an object containing options with the following properties. These are the default options for when [getting data](Cite.html#.get).
 *   1. `type`: The output datatype: `"html"`, `"string"` or `"json"` (default)
 *   2. `format`: The output format: `"html"`, `"string"` or `"json"` (default). This way, you can get a HTML or JSON string instead of an actual object.
 *   3. `style`: The output style. See [Output](#output). `"Vancouver"` is default
 *   4. `lan`: The language. Currently Dutch (`"nl"`) and English (`"en"`, default) are supported
 *
 * **Example:**
 *
 *     var citation = Cite(
 *      {}, //data
 *      {
 *        type:"string",
 *        format:"json"
 *      }
 *     );
 *
 * Now, when you use the `.get()` function, the default options will get you the data as a JSON string.
 *
 * <a name="bibtex">
 * ### BibTeX
 * </a>
 *
 * In the BibTeX-part of the input you simply pass a string of a citation in BibTeX-format. For the BibTeX documentation, see [wikipedia](https://en.wikipedia.org/wiki/BibTeX#Bibliographic_information_file).
 *
 * <a name="json">
 * ### JSON
 * </a>
 *
 * In the JSON-part of the input you pass an object or the string of an object. Your JSON may be "relaxed"; You don't need to worry about double quotes around every single key. Properties are specified below. Note that not all properties are supported for all types.
 *
 * * `type`: the type of citation. May be `"book"`, `"chapter"`, `"article"`, `"e-article"`, `"e-publication"`, `"paper"` or `"newspaper-article"`
 * * `author`: the author(s), listed in an array. Names don't have to be formatted
 * * `editor`: the editor(s), listed in an array. Names don't have to be formatted
 * * `chapterauthor`: the authors of the chapter. Names don't have to be formatted
 * * `title`: the title of the book, publication, etc
 * * `chapter`: the title or number of the chapter
 * * `pages`: the pagenumbers of the citated fragment, listed as integers in an array
 * * `year`: year of publication, as an integer
 * * `pubdate`: object containin following properties, concerning the date of publication
 *   * `from`: date of publication, format dd-mm-yyyy, listed as integers in an array
 * * `date`: object containin following properties, concerning the date of citation
 *   * `from`: date of citation or date of start of conference, format dd-mm-yyyy, listed as integers in an array
 *   * `to`: date of end of conference, format dd-mm-yyyy, listed as integers in an array
 * * `url`: URL of publication
 * * `conference`: object containin following properties, concerning the conference where the thing was presented
 *   * `name`: name of conference
 *   * `org`: name of organisation where conference was held
 *   * `place`: place where conference was held
 *   * `country`: country where conference was held
 *   * for the date of the conference, use `date` (outside of the `con` object)
 * * `journal`: journal the thing is published in
 * * `volume`: the volume of the journal the thing is published in
 * * `number`: the number of the journal the thing is published in 
 * * `place`: the place(s) of publication, listed in an array
 * * `publisher`: the publisher as a string
 *
 * ### Other input types
 *
 * Other supported input types are:
 * * A jQuery or HTML element, where it will use the text content of the elements
 * * Wikidata JSON, where it will try to get as much relevant properties as possible
 * * ContentMine JSON, where it will convert to JSON with custom standard
 * * An URL, where it wil use the fetched data, or extract the Wikidata entity. This uses an synchronous request.
 *
 * <a name="output">
 * ## Ouput
 * </a>
 *
 * When using the `.get()` function, your output depends on the options you pass. If you don't pass any options, the values you passed as default are used. When you haven't passed those, standard options are passed.
 *
 * **`Type` and `Format`**
 *
 * * JSON: Outputs an object with properties as specified in [Input/JSON](#json). Specify as `"JSON"`. Supports all types. Languages are ignored.
 * * String: Outputs a single string with your formatted citation, in the styles below.
 * * HTML: Outputs a set of DOM nodes, containing your formatted citation, in the styles below.
 *
 * **`Styles`**
 *
 * * Vancouver style; specify as `"Vancouver"`. Supports all languages and all types except `"paper"`. Instead of `"paper"`, use `"article"`.
 * * APA style; specify as `"APA"`. Supports all types and languages.
 * * BibTeX: specify as `"BibTeX"`. Supports most types and has no languages. If a type is not supported, `misc` is used.
 * * JSON style: specify as `"JSON"`. Gets you a HMTL-formatted JSON string.
 *
 * # Further explanation
 *
 * Further explanation can be found at the [API](https://larsgw.github.io/citation.js/docs/api/). The explanation of the jQuery plugin can be found there too.
 *
 * # Demo
 *
 * * [Normal demo](https://larsgw.github.io/citation.js/docs/demo/demo.html)
 * * [Demo including jQuery plugin](https://larsgw.github.io/citation.js/docs/demo/jquery.html)
 *
 * # Dependencies
 * 
 * * None!
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

/**
 * Convert an array of names into a string expected by the rules
 * 
 * @function name
 * @param {Array} names - An array of names
 * @param {Object} options - Options for the output
 * @param {String} options.style - Output style, corresponds with the one passed for the output
 * @param {String} options.lan - Output language, corresponds with the one passed for the output
 * 
 * @return The string
 */

function name(names,options) {
  names =  names||[],
  style = options.style||'vancouver',
  lan = options.lan||'en';
  var res = '', b = '';
  switch(style){
    
    case 'apa':
      b += ',';
    case 'eckartapa':
      b += ' & ';
      for (i=0;i<names.length;++i) {
	if (names[i].indexOf(',')>0) {
	  var str = names[i].split(', ');
	  names[i] = str[1] + ' ' + str[0];
	};
	var a = names[i].split(' ');
	res+=a[(a.length-1)] + ',';
	for (j=0;j<(a.length-1);++j) {
	  if (a[j][0] === a[j][0].toUpperCase()) res+=' ' + a[j][0] + '.';
	  else res+=' ' + a[j];
	};
	if (i!=names.length-1&&i!=names.length-2) res += ', ';
	else if (i==names.length-2) res += b;
      };
      break;
      
    case 'bibtex':
      res += names.join(' and ');
      break;
      
    case 'vancouver':default:
      for (i=0;i< (names.length>3?3:names.length) ;++i) {
	if (names[i].indexOf(',')>0) {
	  var str = names[i].split(', ');
	      str = str[1] + ' ' + str[0];
	  names[i] = str;
	};
	var f = '', l = '',
	    a = names[i].replace(/-/g,' ').split(' ');
	for (j=0;j<(a.length-1);++j) {
	  if (a[j][0] === a[j][0].toUpperCase()) f+=a[j][0];
	  else l+=a[j] + ' ';
	};
	l+=a[(a.length-1)];
	res+=l+' '+f;
	if (i<names.length-1) res += ', ';
      }if (names.length>3) res+=' et al.'
      break;
      
  }
    
  return res;
}

/**
 * Convert a date into the correct format
 * 
 * @function date
 * @param {Array} date - An array of dates
 * @param {String} lan - Output language, corresponds with the one passed for the output, except if "BibTeX" style is used (then it's "bx")
 * 
 * @return The string
 */
function date(date,lan) {
  var res = '',
      date = date || {},
      months = {
	en:['January','February','March','April','May','June','July','August','September','October','November','December'],
	bx:['January','February','March','April','May','June','July','August','September','October','November','December'],
	nl:['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
      }[lan] || ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
  console.log(date,lan)
  
  switch(lan){     
    case 'bx':
      
      if(date.from&&date.from.length!=0)res += '{'+date.from[2]+'-'+('0'+date.from[1]).slice(-2)+'-'+('0'+date.from[0]).slice(-2)+'}';
      
      break;
      
    case 'nl':
      
      if(date.from&&date.from.length!=0){
	if(date.to&&date.to.length!=0){
	  if(date.to[2]==date.from[2]){
	    if(date.to[1]==date.from[1]){
	      if(date.to[0]==date.from[0])res += date.from[0]+' '+months[date.from[1]-1].toLowerCase()+' '+date.from[2];
	      else res += date.from[0]+' - '+ date.to[0]+' '+months[(date.from[1]-1)].toLowerCase()+' '+date.from[2];
	    }else res += date.from[0]+' '+months[(date.from[1]-1)].toLowerCase()+' - '+ date.to[0]+' '+months[(date.to[1]-1)].toLowerCase()+' '+date.from[2];
	  }else res += date.from[0]+' '+months[(date.from[1]-1)].toLowerCase()+' '+date.from[2]+' - '+date.to[0]+' '+months[(date.to[1]-1)].toLowerCase()+' '+date.to[2];
	}else res += date.from[0]+' '+months[date.from[1]-1].toLowerCase()+' '+date.from[2];
      }else res += '';
      
      break;
      
    case 'en':default:
      
      if(date.from&&date.from.length!=0){
	if(date.to&&date.to.length!=0){
	  if(date.to[2]==date.from[2]){
	    if(date.to[1]==date.from[1]){
	      if(date.to[0]==date.from[0])res += date.from[0]+' '+months[date.from[1]-1]+' '+date.from[2];
	      else res += date.from[0]+' - '+ date.to[0]+' '+months[(date.from[1]-1)]+' '+date.from[2];
	    }else res += date.from[0]+' '+months[(date.from[1]-1)]+' - '+ date.to[0]+' '+months[(date.to[1]-1)]+' '+date.from[2];
	  }else res += date.from[0]+' '+months[(date.from[1]-1)]+' '+date.from[2]+' - '+date.to[0]+' '+months[(date.to[1]-1)]+' '+date.to[2];
	}else res += date.from[0]+' '+months[date.from[1]-1]+' '+date.from[2];
      }else res += '';
      
      break;
  }
  return res;
}

/**
 * Convert an integer to an ordinal number
 * 
 * @function numToOrd
 * @param {Integer} num - The number
 * @param {String} [lan="en"] - Output language, corresponds with the one passed for the output, except if "BibTeX" style is used (then it's "bx")
 * 
 * @return The string
 */
function numToOrd (num,lan) {
      str = num.toString();
  var res = str,
      rank = {
	nl:['ste','de','de','de'],
	en:['st','nd','rd','th'],
	bx:['st','nd','rd','th']
      }[lan] || ['st','nd','rd','th'];
      
  switch(lan){
    case 'nl':
      
      if (num<3&&num!=0) res+=rank[num-1];
      else if (num<=19) res+=rank[3];
      else if (num>=20) res+=rank[0];
      else res+=rank[3];
      
      break;
      
    case 'en':case 'bx':
    default:
      
      if (parseInt(str.slice(-1))>3) res += rank[3];
      else if (
	(parseInt(str.slice(-1))<=3&&parseInt(str.slice(-1))!=0)&&(num<10||num>19)
      ) res += rank[parseInt(str.slice(-1))-1];
      else res += rank[3];
	
      break;
  }
  return res;
}

/**
 * Convert JSON to HTML. Normally, this would be done in the switch statement, but this function needs to be able to be self-invoked.
 * 
 * @function JSONToHTML
 * @param {Object} src - The data
 * 
 * @return The html (in string form)
 */
function JSONToHTML (src) {
  var res = '<ul style="list-style-type:none"><li>{<ul style="list-style-type:none">';
  for (var i in src) {
    res += src[i] ? '<li>' + i + ':' : '' ;
    if (typeof src[i]=='object'&&!Array.isArray(src[i])&&src[i]){
      if(JSON.stringify(src[i])===JSON.stringify({})) res += '{}';
      else res += JSONToHTML(src[i]);
    }
    else if (typeof src[i]=='object'&&Array.isArray(src[i])) res += JSON.stringify(src[i]);
    else if (typeof src[i]=='string'&&!parseInt(src[i])) res += '"' + src[i] + '"';
    else if (src[i]) res += (src[i]||'').toString();
    res += src[i] ? ',</li>' : '' ;
  }
  res += '</ul>}</li></ul>'
  return res;
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
 * @param {Object} [options={}] - The default options for the output
 * @param {String} options.type - The outputted datatype: "String" , "HTML" or "JSON"
 * @param {String} options.format - The format of the output: "HTML" or "JSON"
 * @param {String} options.style - The style of the output: "Vancouver" or "APA"
 * @param {String} options.lan - The language of the output: "en" or "nl"
 */

function Cite(data,options) {

  // Making it Scope-Safe
  if(!(this instanceof Cite))return new Cite(data,options);

  /**
  * Object containing several RegExp patterns, mostly used for parsing (*full of shame*) and recognizing data types
  * 
  * @default
  */
  this._rgx = {
    url:/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(\:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
    json:[
      /((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g,
      /((?:(?:"|]|}|\/[gmi]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g
    ]
  }

  /**
  * Object containing a list of Wikidata Instances and it's corresponding name as specified by the docs
  * 
  * @default
  */
  this._wikidataInstances = {
    Q13442814:'article',  
    Q3331189:'book',
    Q571:'book'
  }

  /**
  * Object containing functions in a list of Wikidata Properties returning it's corresponding property and value as specified by the docs
  * 
  * @method _wikidataProperties
  * @memberof Cite
  * @default
  */
  this._wikidataProperties = function(a,b){
    switch(b){
      case 'P31'  :
	return ['type',this._wikidataInstances['Q'+a[0].mainsnak.datavalue.value['numeric-id']]||
	(console.warn('This entry type is not recognized and therefore interpreted as \'article\'')||'')+'article'];
	break;
      case 'P212' : return ['isbn',a[0].mainsnak.datavalue.value]; break;
      case 'P304' : return ['pages',(a[0].mainsnak.datavalue.value.split('-')||undefined)]; break;
      case 'P356' : return ['doi',a[0].mainsnak.datavalue.value]; break;
      case 'P393' : return ['print',parseInt(a[0].mainsnak.datavalue.value)]; break;
      case 'P433' : return ['issue',parseInt(a[0].mainsnak.datavalue.value)]; break;
      case 'P478' : return ['volume',parseInt(a[0].mainsnak.datavalue.value)]; break;
      case 'P577' : return ['pubdate',{from:a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-').reverse()}]; break;
      case 'P580' : return ['date',{from:a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-').reverse()}]; break;
      case 'P582' : return ['date',{to:a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-').reverse()}]; break;
      case 'P585' : return ['date',{from:a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-').reverse()}]; break;
      case 'P957' : return ['isbn',a[0].mainsnak.datavalue.value]; break;
      case 'P1476': return ['title',typeof a[0].mainsnak.datavalue.value=='object'?a[0].mainsnak.datavalue.value.text:a[0].mainsnak.datavalue.value]; break;
      case 'P2093':
	var res = [];
	for (var i=0;i<a.length;i++) { res.push(a[i].mainsnak.datavalue.value) };
	return ['author',res];
	break;
      case 'P5770': return ['date',{from:a[0].mainsnak.datavalue.value.time.match(/\+?([\d-]+)T?/)[1].split('-').reverse()}]; break;
      default: return false; break;
    }
  }
  
  /**
   * The keywords (for language support)
   * 
   * @type Object
   * @property en {Object} The English words
   * @property nl {Object} The Dutch words
   */
  this._wordList = {
    en:{
      ed:'ed',
      print:'edition',
      In:'In',
      used:'Used on',
      from:'Retrieved from',
      paper:'Paper presented at the',
      editors:'editors',
      internet:'Internet',
      available:'Available from'
    },
    nl:{
      ed:'red',
      print:'druk',
      In:'In',
      used:'Binnengehaald op',
      from:'van',
      paper:'Paper gepresenteerd op de',
      editors:'redacteuren',
      internet:'Internet',
      available:'Beschikbaar op'      
    }
  }
  
  // Detecting the input format and formatting the data
  var inputType = typeof data, inputFormat, formatData;
  switch(inputType){
    case 'string':
      switch(data.trim(/\s/).charAt(0)){
        case '@':
	  // BibTeX
          inputFormat = 'BibTeX';
          var match = data.match(/@([^\{]+)\{(\w+)\,([^]+)\}/) || [],
	      res={ type:match[1],label:match[2] },
	      pairs = match[3].split('},');
          for(var i=0;i<pairs.length;i++){
	    var key = (pairs[i].split('=')[0]||'').trim(/\s/g),
		val = (pairs[i].split('=')[1]||'').replace(/[\{"\s]*([^"}]+)[\}"\s]*/g,'$1').replace(/\s+/g,' ');
	    res[key] = val;
          };
	  res['author']=res['author']?res['author'].split(' and '):undefined;
	  res['editor']=res['editor']?res['editor'].split(' and '):undefined;
	  res['pages']=res['pages']?res['pages'].split('--'):undefined;
	  res['place']=res['location'];
	  res['title']=res['title']?
	    (function(){
	      var title = res['title'].replace(/({|})/g,'');
	      if(title.slice(-1)=='.')title.slice(0,-1);
	      return title;
	    })()
	  :undefined;
          delete res[''];
          formatData = [res];
          break;
        case '{':case '[':
	  // JSON string (probably)
	  var obj;
	  try       { obj = JSON.parse(data) }
	  catch (e) {
	    console.warn('Input was not valid JSON, switching to experimental parser for invalid JSON')
	    try {
	      obj = JSON.parse(data.replace(this._rgx.json[0],'$1"$2"').replace(this._rgx.json[1],'$1"$2$3$4"$5:'))
	    } catch (e) {
	      console.warn('Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.')
	    }
	  }
	  var res = new Cite(obj);
	  inputFormat = 'string/' + res._input.format;
          formatData = res.data;
	  break;
        default:
	  data = data.replace(/(^\s+|\s+$)/g,'');
	  // URL
	  if (this._rgx.url.test(data)) {
	    if(data.match(/\/(Q\d+)$/))data='https://www.wikidata.org/wiki/Special:EntityData/'+data.match(/\/(Q\d+)$/)[1]+'.json';
	    var xmlHttp = new XMLHttpRequest();
	    try {
	      xmlHttp.open( "GET", data, false );
	      xmlHttp.send( null );
	    } catch(e) {
	      console.warn('File could not be fetched');
	    }
	    var res = xmlHttp.responseText===data?console.warn('Infinite chaining loop detected'):new Cite(xmlHttp.responseText);
	    inputFormat = 'url/' + res._input.format;
	    formatData = res.data;
	  } else {
	    inputFormat = 'else', formatData = [];
	    console.warn('This format is not supported (yet)'); }
          break;
      }
      break;
    case 'object':
      // Array
      if (Array.isArray( data )) {
	inputFormat = 'json', res = [] ;
	for (obj=0;obj<data.length;obj++) { res = res.concat((new Cite(data[obj])).data) }
	formatData = res;
      }
      // jQuery & HTML
      else if (window.jQuery&&data instanceof jQuery) inputFormat = 'jQuery', data = data.val()||data.text()||data.html(), formatData = new Cite(data,options);
      else if (window.HMTLElement&&data instanceof HMTLElement) inputFormat = 'HTML', data = data.value||data.textContent, formatData = new Cite(data,options);
      // JSON structures
      else {
	// Wikidata
	if ( data.hasOwnProperty('entities') ) {
	  inputFormat = 'json/wikidata';
	  var obj = data.entities[Object.keys(data.entities)[0]].claims, res = {};
	  for (var prop in obj) {
	    var val = this._wikidataProperties(obj[prop],prop)
	    if (prop) res[val[0]]=val[1]; else continue;
	  } res.title = res.title || data.entities[Object.keys(data.entities)[0]].labels.en.value;
	  formatData = [res];
	}
	// ContentMine
	else if ( data.hasOwnProperty('fulltext_html')||data.hasOwnProperty('fulltext_xml')||data.hasOwnProperty('fulltext_pdf') ) {
	  inputFormat = 'json/contentmine';
	  var res = {};
	  for (var prop in data) res[prop]=data[prop].value[0];
	  res.author= 'article';
	  res.author= data.authors?data.authors.value:undefined;
	  res.number= parseInt(res.issue    ) ||undefined;
	  res.volume= parseInt(res.volume   ) ||undefined;
	  res.page  =[parseInt(res.firstpage)]||undefined;
	  res.pubdate  =        {           };
	  res.pubdate.from=data.date?data.date.value[0].split('-').reverse().map(function(x){return parseInt(x)}):undefined;
	  res.year  = res.year?res.year:(res.pubdate.from||[])[2];
	  delete res.authors;
	  delete res.issue  ;
	  delete res.date   ;
	  formatData = [res];
	}
	// Default
	else inputFormat = 'json', formatData = [data];
      }
      break;
    case 'undefined':
      inputFormat = 'empty';
      formatData = [];
      break;
    default:
      inputFormat = 'else';
      formatData = [];
      console.warn('This format is not supported (yet)');
      break;
  }
  
  // Setting reference data
  
  /**
   * The default options for the output
   *
   * @property type {String} The outputted datatype: "String" , "HTML" or "JSON"
   * @property format {String} The format of the output: "HTML" or "JSON"
   * @property style {String} The style of the output: "Vancouver" or "APA"
   * @property lan {String} The language of the output: "en" or "nl"
   * @type Object
   * @default {}
   */
  
  this._options = options || {},
  
  /**
   * Information about the input data
   *
   * @property data The inputted data
   * @property type {String} The datatype of the input
   * @property format {String} The format of the input, if the input is a string
   * @type Object
   */
  this._input = {
    data:data,
    type:inputType,
    format:inputFormat
  },
  
  /**
   * The data formatted to JSON
   *
   * @type Object
   * @default []
   */
  this.data = formatData || [];
  
  /**
   * The log, containing all logged data.
   * 
   * These are the names of each called function, together with it's input. If the `Cite` object is changed, the version number get's updated as well.
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
  ],
  
  // Methods
  
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
  },
  
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
  },
  
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
  },
  
  /**
  * Add an object to the array of objects
  * 
  * @method add
  * @memberof Cite
  * @this Cite
  * 
  * @param data The passed data to add to the object
  * @return The updated parent object
  */
  this.add = function (data) {
    this._log.push({name:'add',version:this.currentVersion()+1,arguments:[data]});
    var input = (new Cite(data)).data;
    for (i=0;i<input.length;i++) { this.data.push(input[i]) };
    return this;
  }
  
  /**
   * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
   * 
   * @method set
   * @memberof Cite
   * @this Cite
   * 
   * @param {(Object[]|Object|String)} data - pass the data
   * @param {Object} [options={}] - The default options for the output
   * @param {String} options.type - The outputted datatype: "String" , "HTML" or "JSON"
   * @param {String} options.format - The format of the output: "HTML" or "JSON"
   * @param {String} options.style - The style of the output: "Vancouver" or "APA"
   * @param {String} options.lan - The language of the output: "en" or "nl"
   * @return The updated parent object
   */
  this.set = function (data, options) {
    this._log.push({name:'set',version:this.currentVersion()+1,arguments:[data,options]});
    data = data || this.data,
    options = options || this._options;
    var object = new Cite(data, options);
    this.data = object.data;
    this._options = object._options;
    return this;
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
    this._log.push({name:'reset',version:this.currentVersion()+1,arguments:[]});
    this.data = [],
    this._options = {};
    return this;
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
    this._log.push({name:'sort',version:this.currentVersion()+1});
    this.data.sort(function(a,b){
      var labela =
	(a.author ? name([].concat(a.author),'apa').split(' ')[0].toLowerCase() : '')+
	(a.year ? a.year : '' )+
	(a.title ? a.title.split(' ')[0].toLowerCase() : '' ),
	  labelb =
	(b.author ? name([].concat(b.author),'apa').split(' ')[0].toLowerCase() : '')+
	(b.year ? b.year : '' )+
	(b.title ? b.title.split(' ')[0].toLowerCase() : '' );
      return labela != labelb ?
	( labela > labelb ? 1 : -1 )
      : 0 ;
    });
    return this;
  }
  
  /**
   * Change the default options of a `Cite` object.
   * 
   * @method options
   * @memberof Cite
   * @this Cite
   * 
   * @param {Object} [options={}] - The default options for the output
   * @param {String} options.type - The outputted datatype: "String" , "HTML" or "JSON"
   * @param {String} options.format - The format of the output: "HTML" or "JSON"
   * @param {String} options.style - The style of the output: "Vancouver" or "APA"
   * @param {String} options.lan - The language of the output: "en" or "nl"
   * @return The updated parent object
   */
  this.options = function (options) {
    this._log.push({name:'options',version:this.currentVersion()+1,arguments:[options]});
    for (i in options) {
      this._options[i] = options[i];
    }
    return this;
  }
  
  /**
  * GET formatted data from your object. For more info, see [Output](./#output).
  * 
  * @method get
  * @memberof Cite
  * @this Cite
  * 
  * @param {Object} [options={}] - The default options for the output
  * @param {String} [options.type="JSON"] - The outputted datatype: "String" , "HTML" or "JSON"
  * @param {String} [options.format="JSON"] - The format of the output: "String", "HTML" or "JSON"
  * @param {String} [options.style="Vancouver"] - The style of the output: "Vancouver" or "APA"
  * @param {String} [options.lan="en"] - The language of the output: "en" or "nl"
  * @return The formatted data
  */
  this.get = function (options,nolog) {
    if(!nolog)this._log.push({name:'get',arguments:[options]});
    options = (options||this._options)||{};
    switch((options.type||'').toLowerCase()){
      
      case 'string':
	var res = '', words = this._wordList[(options.lan||'en')] ;
	switch(options.format){
	  case 'html':
	    
	    for(var i=0;i<this.data.length;i++){
	      var src = this.data[i]||{},
		  pubType = (src.type||'').toLowerCase(),
		  style = (options.style||'').toLowerCase();
	      switch(style){
		case 'apa':
		case 'eckartapa':
		  res += '<p>';
		  
		  switch(pubType){
		    
		    case 'book':case 'boek':
		    case 'chapter':case 'hoofdstuk':
		      
		      res += src.chapterauthor || (src.chapterauthor&&src.editor) ? name(
			[].concat(src.chapterauthor||[]).concat(src.editor||[]),
			{style:style,lan:options.lan}
		      ) + ' ' : '' ;
		      res += src.year && pubType=='chapter' ? '('+src.year+') ' : '' ;
		      res += src.chapter ? '('+src.chapter+') ' : '' ;
		      res += src.author || src.editor ? ( pubType=='chapter' ? words['in'] + ' ' : '' ) + name(
			[].concat(src.author||[]).concat(src.editor||[]),
			{style:style,lan:options.lan}
		      ) + ' ' : '' ;
		      res += src.editor ? '('+words['ed']+'.) ' : '' ;
		      res += src.year && pubType!='chapter' ? '('+src.year+') ' : '' ;
		      res += res.slice(-3) !== '<p>' ? '. ' : '' ;
		      res += src.title ? '<i>'+src.title+'</i> ' : '' ;
		      res += (src.pages||[])[0] ? '( p. '+src.pages[0]+(src.pages[1]?'-'+src.pages[1]:'')+' )' : '' ;
		      res += src.print ? '('+src.print+'<sup>e</sup> '+words['print']+')' : '' ;
		      res += src.place ? ' ' + ( Array.isArray(src.place) ? src.place.join('/') : src.place) : '';
		      res += src.publisher ? ':'+src.publisher+'.' : '.' ;
		      
		      break;
		      
		    case 'e-publication':case 'e-publicatie':case 'website':
		      
		      res += src.author ? name([].concat(src.author||[]),{style:style,lan:options.lan}) + ' ' : '' ;
		      res += src.pubdate ?
			'('+
			( (src.pubdate.from||[]).length === 3 ? src.pubdate.from[2] + ', ' : '' ) +
			( src.pubdate.from || src.pubdate.to ? date(src.pubdate,options.lan).split(' ').slice(0,2).join(' ') : '' ) +
			')'
		      : '' ;
		      res += res.slice(-3) !== '<p>' ? '. ' : '' ;
		      res += src.title ? '<i>'+src.title+'</i> ' : '' ;
		      res += src.date ? '. ' + words['used'] + ' ' + date(src.date,options.lan) : '' ;
		      res += src.url ? ', ' + words['from'] + ' <a href="' + src.url + '" >' + src.url + '</a>' : '' ;
		      
		      break;
		      
		    case 'paper':
		      src.con = src.conference || {};
		      
		      res += src.author ? name([].concat(src.author||[]),{style:style,lan:options.lan}) + ' ' : '' ;
		      res += src.year ? '('+src.year+')' : '' ;
		      res += src.title ? '<i>'+src.title+'</i> ' : '' ;
		      res += src.con.name ? words['paper'] + ' ' + src.con.name : '' ;
		      res += src.con.org ? ', ' + src.con.org : '' ;
		      res += src.place ? ', ' + ( Array.isArray(src.con.place) ? src.con.place.join('/') : src.con.place) : '';
		      res += src.con.country ? ', ' + src.con.country : '' ;
		      res += src.date ? ', ' + date(src.date,options.lan) + '.' : '.' ;
		      
		      break;
		      
		    case 'newspaper':console.warn('This is not the official name');
		    case 'newspaper-article':case 'krantenartikel':
		      
		      res += src.author ? name([].concat(src.author||[]),{style:style,lan:options.lan}) + ' ' : '' ;
		      res += src.pubdate ?
			'('+
			( (src.pubdate.from||[]).length === 3 ? src.pubdate.from[2] + ', ' : '' ) +
			( src.pubdate.from || src.pubdate.to ? date(src.pubdate,options.lan).split(' ').slice(0,2).join(' ') : '' ) +
			')'
		      : '' ;
		      res += res.slice(-3) !== '<p>' ? '. ' : '' ;
		      res += src.title ? src.title+'. ' : '' ;
		      res += (src.pages||[])[0] ? ', p. '+src.pages[0]+(src.pages[1]?'-'+src.pages[1]:'')+'.' : '' ;
		      
		      break;
		      
		    case 'article':case 'artikel':
		    case 'e-article':case 'e-artikel':
		    default:
		      
		      res += src.author ? name([].concat(src.author||[]),{style:style,lan:options.lan}) + ' ' : '' ;
		      res += src.year ? '('+src.year+')' : '' ;
		      res += res.slice(-3) !== '<p>' ? '. ' : '' ;
		      res += src.title ? src.title+'. ' : '' ;
		      res += src.journal ? '<i>' + src.journal : '<i>';
		      res += src.journal && src.volume ? ', ' : '' ;
		      res += src.volume ? src.volume + '</i>' : '</i> ';
		      res += src.number ? '('+src.number+')' : '' ;
		      res += (src.pages||[])[0] ? ', ' + src.pages[0]+(src.pages[1]?'-'+src.pages[1]:'') : '' ;
		      res += res.slice(-2) !== ', ' && res.slice(-3) !== '<p>' ? '. ' : '' ;
		      res += src.date ? words['used'] + ' ' + date(src.date,options.lan) + '. ' : '' ;
		      res += src.doi ? '<a href="https://doi.org/'+src.doi+'" >doi:' + src.doi + '</a>' : '' ;
		      res += src.url && ! src.doi ? words['from'] + '<a href="' + src.url + '" >' + src.url + '</a>' : '' ;
		      
		      break;
		    
		  }
		  
		  res += '</p>';
		  break;
		  
		case 'bibtex':
		  
		  var arr=[];
		  res += '<ul style="list-style-type:none"><li>@';
		  
		  switch(pubType){
		    case 'book':case 'boek':
		      res += 'book';break;
		      
		    case 'chapter':case 'hoofdstuk':
		      res += 'inbook';break;
		      
		    case 'newspaper':console.warn('This is not the official name');case 'newspaper-article':case 'krantenartikel':
		    case 'e-publication':case 'e-publicatie':case 'e-article':case 'e-artikel':
		    case 'article':case 'artikel':
		      res += 'article';break;
		      
		    case 'paper':
		      res += 'inproceedings';break;
		      break;
		      
		    default:
		      res += 'misc';break;
		  }
		  
		  res += '{';
		  res += src.author ? name([].concat(src.author),'apa').split(' ')[0].toLowerCase() : '' ;
		  res += src.year ? src.year : '' ;
		  res += src.title ? src.title.split(' ')[0].toLowerCase() : '' ;
		  res += ',<ul style="list-style-type:none">';
		  arr.push(
		    src.title?'title={{'+src.title+'}}':'',
		    src.author?'author={'+name(src.author, {style:'bibtex'})+'}':'',
		    src.editor?'editor={'+name(src.editor, {style:'bibtex'})+'}':'',
		    src.print?'edition={'+src.print+'}':'',
		    src.volume?'volume={'+src.volume+'}':'',
		    src.number?'number={'+src.number+'}':'',
		    src.pages?'pages={'+src.pages[0]+'--'+(src.pages[1]||src.pages[0])+'}':'',
		    src.year?'year={'+src.year+'}':((src.pubdate||[])[2]?src.pubdate[2]:''),
		    src.url?'url={'+src.url+'}':'',
		    src.date?'note={[Online; accesed '+date(src.date,'bx')+']}':'',
		    src.journal?'journal={'+src.journal+'}':'',
		    (src.conference||{}).org?'organization={'+src.conference.org+'}':'',
		    src.place?'address={'+(Array.isArray(src.place)?src.place[0]:src.place)+'}':'',
		    src.publisher?'publisher={'+src.publisher+'}':'',
		    src.doi?'doi={'+src.doi+'}':'',
		    //Properties currently only used for BibTeX
		    src.isbn?'isbn={'+src.isbn+'}':'',
		    src.issn?'issn={'+src.issn+'}':''
		  );
		  arr  = arr.join('joining').replace(/(joining)+/g,'joining').replace(/(^joining|joining$)/g,'').split('joining');
		  res += '<li>'+arr.join(',</li><li>')+'</li>';
		  res += '</ul>}</li></ul>';
		  
		  break;
		
		case 'json':
		  res += JSONToHTML(src);
		  break;
		
		/*case 'harvard':
		  res += '<p>';
		  
		  switch (pubType){
		    
		    case 'book':case 'boek':
		      
		      break;
		    
		  }
		  
		  res += '</p>';
		  break;*/
		  
		case 'vancouver':
		default:
		  res += '<p>';
		  
		  res += src.chapterauthor || (src.chapterauthor&&src.editor) ? name(
		    [].concat(src.chapterauthor||[]).concat(src.editor||[]),
		    {style:style,lan:options.lan}
		  ) + ' ' : '' ;
		  res += src.chapter ? src.chapter+'. '+words['in']+': ' : '' ;
		  res += src.author || src.editor ? name(
		    [].concat(src.author||[]).concat(src.editor||[]),
		    {style:style,lan:options.lan}
		  ) + ', ' + words['editors'] : '' ;
		  res += res.slice(-1) !== '>' ? '. ' : '' ;
		  res += src.title ? src.title+'. ' : '' ;
		  
		  switch(pubType){
		    
		    case 'book':case 'boek':
		    case 'chapter':case 'hoofdstuk':
		      
		      res += src.print ? numToOrd(src.print,options.lan)+' '+words['print']+'. ' : ' ';
		      res += src.place ? ' ' + ( Array.isArray(src.place) ? src.place.join('/') : src.place) + ':' : '';
		      res += src.publisher ? ' '+src.publisher : '' ;
		      res += src.year ? '; '+src.year+'.' : '.' ;
		      
		      break;
		      
		    case 'newspaper':console.warn('This is not the official name');
		    case 'newspaper-article':case 'krantenartikel':
		    case 'e-article':case 'e-artikel':
		    case 'e-publication':case 'e-publicatie':
		    case 'article':case 'artikel':
		    default:
		      
		      res += src.journal ? src.journal + (pubType[0]=='e'?'['+words['internet']+']':'') + '. ' : '' ;
		      res += src.year ? src.year+'; ' : '' ;
		      res += src.volume ? src.volume : '' ;
		      res += (src.pages||[])[0] ? ': '  + src.pages[0] + ( src.pages[1] ? '-' + src.pages[1]: '' ) : '' ;
		      res += src.url ? '. ' + words['available'] + ': <a href="' + src.url + '" >' + src.url + '</a>' : '' ;
		      
		      break;
		    
		  }
		  
		  res += '</p>';
		  break;
		  
	      }
	    }
	    
	    res  = res
	    .replace(/(\s+)/g,' ').replace(/(\.+)/g,'.').replace(/\,+/,',')
	    .replace(/([\.\s]{3,})/g,'. ')
	    .replace(/\s+$/,'').replace(/^\s+/,'');
	    
	    break;
	    
	  case 'string':
	    var tmp = document.createElement('div');
	    tmp.innerHTML = this.get({type:'string',format:'html',style:options.style,lan:options.lan},true);
	    return tmp.textContent||tmp.innerText;
	    break;
	    
	  case 'json':
	  default:
	    res += JSON.stringify(this.data);
	    break;
	}
	return res;
	break;
	
      case 'html':
	var tmp = document.createElement('div');
	tmp.innerHTML = this.get({type:'string',format:'html',style:options.style,lan:options.lan},true);
	return tmp.childNodes[0];
	break;
	
      case 'json':
      default:
	return this.data;
	break;
    }
  }
  
}