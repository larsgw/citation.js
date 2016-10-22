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

var Cite = ( function ( window, modules, nodejsMode, browserMode ) {

var CSL = modules.CSL
  , striptag = modules.striptags

if ( nodejsMode ) {
  
  console.info( '[init]', 'Node.js mode' )
  
  var window = {}    
  
} else if ( browserMode ) {
  
  console.info( '[init]', 'Browser mode' )
  
  var window = window
  
} else throw new Error( 'Code executed in invalid environment' )

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
 * CSL pub type to BibTeX pub type
 * 
 * @method getBibTeXType
 * 
 * @param pubType CSL input
 * @return Type
 */
var getBibTeXType = function ( pubType ) {
  switch ( pubType ) {
    case 'book':
      return 'book';
      break;
      
    case 'article-journal':
    case 'article-newspaper':
    case 'article':
      return 'article';
      break;
      
    default:
      return 'misc';
      break;
  }
}

/**
 * Object containing CSL templates
 * 
 * Templates from the [CSL Project](http://citationstyles.org/)  
 * [REPO](https://github.com/citation-style-language/styles), [LICENSE](https://creativecommons.org/licenses/by-sa/3.0/)
 * 
 * Accesed 10/22/2016
 * 
 * @default
 */
var CSLTemplates = {
  apa: '<?xml version="1.0" encoding="utf-8"?><style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="never"><info><title>American Psychological Association 6th edition</title><title-short>APA</title-short><id>http://www.zotero.org/styles/apa</id><link href="http://www.zotero.org/styles/apa" rel="self"/><link href="http://owl.english.purdue.edu/owl/resource/560/01/" rel="documentation"/><author><name>Simon Kornblith</name><email>simon@simonster.com</email></author><contributor><name>Bruce D\'Arcus</name></contributor><contributor><name>Curtis M. Humphrey</name></contributor><contributor><name>Richard Karnesky</name><email>karnesky+zotero@gmail.com</email><uri>http://arc.nucapt.northwestern.edu/Richard_Karnesky</uri></contributor><contributor><name>Sebastian Karcher</name></contributor><contributor><name> Brenton M. Wiernik</name><email>zotero@wiernik.org</email></contributor><category citation-format="author-date"/><category field="psychology"/><category field="generic-base"/><updated>2016-05-25T09:01:49+00:00</updated><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights></info><locale xml:lang="en"><terms><term name="editortranslator" form="short"><single>ed. &amp; trans.</single><multiple>eds. &amp; trans.</multiple></term><term name="translator" form="short"><single>trans.</single><multiple>trans.</multiple></term></terms></locale><macro name="container-contributors"><choose><if type="chapter paper-conference entry-dictionary entry-encyclopedia" match="any"><group delimiter=", "><names variable="container-author" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=" (" text-case="title" suffix=")"/></names><names variable="editor translator" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=" (" text-case="title" suffix=")"/></names></group></if></choose></macro><macro name="secondary-contributors"><choose><if type="article-journal chapter paper-conference entry-dictionary entry-encyclopedia" match="none"><group delimiter=", " prefix=" (" suffix=")"><names variable="container-author" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=", " text-case="title"/></names><names variable="editor translator" delimiter=", "><name and="symbol" initialize-with=". " delimiter=", "/><label form="short" prefix=", " text-case="title"/></names></group></if></choose></macro><macro name="author"><names variable="author"><name name-as-sort-order="all" and="symbol" sort-separator=", " initialize-with=". " delimiter=", " delimiter-precedes-last="always"/><label form="short" prefix=" (" suffix=")" text-case="capitalize-first"/><substitute><names variable="editor"/><names variable="translator"/><choose><if type="report"><text variable="publisher"/><text macro="title"/></if><else><text macro="title"/></else></choose></substitute></names></macro><macro name="author-short"><names variable="author"><name form="short" and="symbol" delimiter=", " initialize-with=". "/><substitute><names variable="editor"/><names variable="translator"/><choose><if type="report"><text variable="publisher"/><text variable="title" form="short" font-style="italic"/></if><else-if type="legal_case"><text variable="title" font-style="italic"/></else-if><else-if type="bill book graphic legislation motion_picture song" match="any"><text variable="title" form="short" font-style="italic"/></else-if><else-if variable="reviewed-author"><choose><if variable="reviewed-title" match="none"><text variable="title" form="short" font-style="italic" prefix="Review of "/></if><else><text variable="title" form="short" quotes="true"/></else></choose></else-if><else><text variable="title" form="short" quotes="true"/></else></choose></substitute></names></macro><macro name="access"><choose><if type="thesis report" match="any"><choose><if variable="DOI" match="any">'+
'<text variable="DOI" prefix="https://doi.org/"/></if><else-if variable="archive" match="any"><group><text term="retrieved" text-case="capitalize-first" suffix=" "/><text term="from" suffix=" "/><text variable="archive" suffix="."/><text variable="archive_location" prefix=" (" suffix=")"/></group></else-if><else><group><text term="retrieved" text-case="capitalize-first" suffix=" "/><text term="from" suffix=" "/><text variable="URL"/></group></else></choose></if><else><choose><if variable="DOI"><text variable="DOI" prefix="https://doi.org/"/></if><else><choose><if type="webpage"><group delimiter=" "><text term="retrieved" text-case="capitalize-first" suffix=" "/><group><date variable="accessed" form="text" suffix=", "/></group><text term="from"/><text variable="URL"/></group></if><else><group><text term="retrieved" text-case="capitalize-first" suffix=" "/><text term="from" suffix=" "/><text variable="URL"/></group></else></choose></else></choose></else></choose></macro><macro name="title"><choose><if type="book graphic manuscript motion_picture report song speech thesis" match="any"><choose><if variable="version" type="book" match="all"><text variable="title"/></if><else><text variable="title" font-style="italic"/></else></choose></if><else-if variable="reviewed-author"><choose><if variable="reviewed-title"><group delimiter=" "><text variable="title"/><group delimiter=", " prefix="[" suffix="]"><text variable="reviewed-title" font-style="italic" prefix="Review of "/><names variable="reviewed-author" delimiter=", "><label form="verb-short" suffix=" "/><name and="symbol" initialize-with=". " delimiter=", "/></names></group></group></if><else><group delimiter=", " prefix="[" suffix="]"><text variable="title" font-style="italic" prefix="Review of "/><names variable="reviewed-author" delimiter=", "><label form="verb-short" suffix=" "/><name and="symbol" initialize-with=". " delimiter=", "/></names></group></else></choose></else-if><else><text variable="title"/></else></choose></macro><macro name="title-plus-extra"><text macro="title"/><choose><if type="report thesis" match="any"><group prefix=" (" suffix=")" delimiter=", "><group delimiter=" "><choose><if variable="genre" match="any"><text variable="genre"/></if><else><text variable="collection-title"/></else></choose><text variable="number" prefix="No. "/></group><group delimiter=" "><text term="version" text-case="capitalize-first"/><text variable="version"/></group><text macro="edition"/></group></if><else-if type="post-weblog webpage" match="any"><text variable="genre" prefix=" [" suffix="]"/></else-if><else-if variable="version"><group delimiter=" " prefix=" (" suffix=")"><text term="version" text-case="capitalize-first"/><text variable="version"/></group></else-if></choose><text macro="format" prefix=" [" suffix="]"/></macro><macro name="format"><choose><if match="any" variable="medium"><text variable="medium" text-case="capitalize-first"/></if><else-if type="dataset" match="any"><text value="Data set"/></else-if></choose></macro><macro name="publisher"><choose><if type="report" match="any"><group delimiter=": "><text variable="publisher-place"/><text variable="publisher"/></group></if><else-if type="thesis" match="any"><group delimiter=", "><text variable="publisher"/><text variable="publisher-place"/></group></else-if><else-if type="post-weblog webpage" match="none"><group delimiter=", "><choose><if variable="event version" type="speech motion_picture" match="none"><text variable="genre"/></if></choose><choose><if type="article-journal article-magazine" match="none"><group delimiter=": "><choose><if variable="publisher-place"><text variable="publisher-place"/></if><else><text variable="event-place"/></else></choose><text variable="publisher"/></group></if></choose></group></else-if></choose></macro><macro name="event"><choose><if variable="container-title" match="none"><choose><if variable="event"><choose><if variable="genre" match="none"><text term="presented at" text-case="capitalize-first" suffix=" "/><text variable="event"/></if><else>'+
'<group delimiter=" "><text variable="genre" text-case="capitalize-first"/><text term="presented at"/><text variable="event"/></group></else></choose></if><else-if type="speech"><text variable="genre" text-case="capitalize-first"/></else-if></choose></if></choose></macro><macro name="issued"><choose><if type="bill legal_case legislation" match="none"><choose><if variable="issued"><group prefix=" (" suffix=")"><date variable="issued"><date-part name="year"/></date><text variable="year-suffix"/><choose><if type="speech" match="any"><date variable="issued"><date-part prefix=", " name="month"/></date></if><else-if type="article-journal bill book chapter graphic legal_case legislation motion_picture paper-conference report song dataset" match="none"><date variable="issued"><date-part prefix=", " name="month"/><date-part prefix=" " name="day"/></date></else-if></choose></group></if><else-if variable="status"><group prefix=" (" suffix=")"><text variable="status"/><text variable="year-suffix" prefix="-"/></group></else-if><else><group prefix=" (" suffix=")"><text term="no date" form="short"/><text variable="year-suffix" prefix="-"/></group></else></choose></if></choose></macro><macro name="issued-sort"><choose><if type="article-journal bill book chapter graphic legal_case legislation motion_picture paper-conference report song dataset" match="none"><date variable="issued"><date-part name="year"/><date-part name="month"/><date-part name="day"/></date></if><else><date variable="issued"><date-part name="year"/></date></else></choose></macro><macro name="issued-year"><choose><if variable="issued"><group delimiter="/"><date variable="original-date" form="text"/><group><date variable="issued"><date-part name="year"/></date><text variable="year-suffix"/></group></group></if><else-if variable="status"><text variable="status"/><text variable="year-suffix" prefix="-"/></else-if><else><text term="no date" form="short"/><text variable="year-suffix" prefix="-"/></else></choose></macro><macro name="edition"><choose><if is-numeric="edition"><group delimiter=" "><number variable="edition" form="ordinal"/><text term="edition" form="short"/></group></if><else><text variable="edition"/></else></choose></macro><macro name="locators"><choose><if type="article-journal article-magazine" match="any"><group prefix=", " delimiter=", "><group><text variable="volume" font-style="italic"/><text variable="issue" prefix="(" suffix=")"/></group><text variable="page"/></group><choose><if variable="issued"><choose><if variable="page issue" match="none"><text variable="status" prefix=". "/></if></choose></if></choose></if><else-if type="article-newspaper"><group delimiter=" " prefix=", "><label variable="page" form="short"/><text variable="page"/></group></else-if><else-if type="book graphic motion_picture report song chapter paper-conference entry-encyclopedia entry-dictionary" match="any"><group prefix=" (" suffix=")" delimiter=", "><choose><if type="report" match="none"><text macro="edition"/></if></choose><choose><if variable="volume" match="any"><group><text term="volume" form="short" text-case="capitalize-first" suffix=" "/><number variable="volume" form="numeric"/></group></if><else><group><text term="volume" form="short" plural="true" text-case="capitalize-first" suffix=" "/><number variable="number-of-volumes" form="numeric" prefix="1&#8211;"/></group></else></choose><group><label variable="page" form="short" suffix=" "/><text variable="page"/></group></group></else-if><else-if type="legal_case"><group prefix=" (" suffix=")" delimiter=" "><text variable="authority"/><date variable="issued" form="text"/></group></else-if><else-if type="bill legislation" match="any"><date variable="issued" prefix=" (" suffix=")"><date-part name="year"/></date></else-if></choose></macro><macro name="citation-locator"><group><choose><if locator="chapter"><label variable="locator" form="long" text-case="capitalize-first"/></if><else><label variable="locator" form="short"/></else></choose><text variable="locator" prefix=" "/></group></macro>'+
'<macro name="container"><choose><if type="post-weblog webpage" match="none"><group><choose><if type="chapter paper-conference entry-encyclopedia" match="any"><text term="in" text-case="capitalize-first" suffix=" "/></if></choose><group delimiter=", "><text macro="container-contributors"/><text macro="secondary-contributors"/><text macro="container-title"/></group></group></if></choose></macro><macro name="container-title"><choose><if type="article article-journal article-magazine article-newspaper" match="any"><text variable="container-title" font-style="italic" text-case="title"/></if><else-if type="bill legal_case legislation" match="none"><text variable="container-title" font-style="italic"/></else-if></choose></macro><macro name="legal-cites"><choose><if type="bill legal_case legislation" match="any"><group delimiter=" " prefix=", "><choose><if variable="container-title"><text variable="volume"/><text variable="container-title"/><group delimiter=" "><text term="section" form="symbol"/><text variable="section"/></group><text variable="page"/></if><else><choose><if type="legal_case"><text variable="number" prefix="No. "/></if><else><text variable="number" prefix="Pub. L. No. "/><group delimiter=" "><text term="section" form="symbol"/><text variable="section"/></group></else></choose></else></choose></group></if></choose></macro><macro name="original-date"><choose><if variable="original-date"><group prefix="(" suffix=")" delimiter=" "><text value="Original work published"/><date variable="original-date" form="text"/></group></if></choose></macro><citation et-al-min="6" et-al-use-first="1" et-al-subsequent-min="3" et-al-subsequent-use-first="1" disambiguate-add-year-suffix="true" disambiguate-add-names="true" disambiguate-add-givenname="true" collapse="year" givenname-disambiguation-rule="primary-name"><sort><key macro="author"/><key macro="issued-sort"/></sort><layout prefix="(" suffix=")" delimiter="; "><group delimiter=", "><text macro="author-short"/><text macro="issued-year"/><text macro="citation-locator"/></group></layout></citation><bibliography hanging-indent="true" et-al-min="8" et-al-use-first="6" et-al-use-last="true" entry-spacing="0" line-spacing="2"><sort><key macro="author"/><key macro="issued-sort" sort="ascending"/><key macro="title"/></sort><layout><group suffix="."><group delimiter=". "><text macro="author"/><text macro="issued"/><text macro="title-plus-extra"/><text macro="container"/></group><text macro="legal-cites"/><text macro="locators"/><group delimiter=", " prefix=". "><text macro="event"/><text macro="publisher"/></group></group><text macro="access" prefix=" "/><text macro="original-date" prefix=" "/></layout></bibliography></style>'
, vancouver: '<?xml version="1.0" encoding="utf-8"?><style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal"><info><title>Vancouver</title><id>http://www.zotero.org/styles/vancouver</id><link href="http://www.zotero.org/styles/vancouver" rel="self"/><link href="http://www.nlm.nih.gov/bsd/uniform_requirements.html" rel="documentation"/><author><name>Michael Berkowitz</name><email>mberkowi@gmu.edu</email></author><contributor><name>Sean Takats</name><email>stakats@gmu.edu</email></contributor><contributor><name>Sebastian Karcher</name></contributor><category citation-format="numeric"/><category field="medicine"/><summary>Vancouver style as outlined by International Committee of Medical Journal Editors Uniform Requirements for Manuscripts Submitted to Biomedical Journals: Sample References</summary><updated>2014-09-06T16:03:01+00:00</updated><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights></info><locale xml:lang="en"><date form="text" delimiter=" "><date-part name="year"/><date-part name="month" form="short" strip-periods="true"/><date-part name="day"/></date><terms><term name="collection-editor" form="long"><single>editor</single><multiple>editors</multiple></term><term name="presented at">presented at</term><term name="available at">available from</term><term name="section" form="short">sect.</term></terms></locale><locale xml:lang="fr"><date form="text" delimiter=" "><date-part name="day"/><date-part name="month" form="short" strip-periods="true"/><date-part name="year"/></date></locale><macro name="author"><names variable="author"><name sort-separator=" " initialize-with="" name-as-sort-order="all" delimiter=", " delimiter-precedes-last="always"/><label form="long" prefix=", "/><substitute><names variable="editor"/></substitute></names></macro><macro name="editor"><names variable="editor" suffix="."><name sort-separator=" " initialize-with="" name-as-sort-order="all" delimiter=", " delimiter-precedes-last="always"/><label form="long" prefix=", "/></names></macro><macro name="chapter-marker"><choose><if type="chapter paper-conference entry-dictionary entry-encyclopedia" match="any"><text term="in" text-case="capitalize-first"/></if></choose></macro><macro name="publisher"><choose><if type="article-journal article-magazine article-newspaper" match="none"><group delimiter=": " suffix=";"><choose><if type="thesis"><text variable="publisher-place" prefix="[" suffix="]"/></if><else-if type="speech"/><else><text variable="publisher-place"/></else></choose><text variable="publisher"/></group></if></choose></macro><macro name="access"><choose><if variable="URL"><group delimiter=": "><text term="available at" text-case="capitalize-first"/><text variable="URL"/></group></if></choose></macro><macro name="accessed-date"><choose><if variable="URL"><group prefix="[" suffix="]" delimiter=" "><text term="cited" text-case="lowercase"/><date variable="accessed" form="text"/></group></if></choose></macro><macro name="container-title"><choose><if type="article-journal article-magazine chapter paper-conference article-newspaper review review-book entry-dictionary entry-encyclopedia" match="any"><group suffix="." delimiter=" "><choose><if type="article-journal review review-book" match="any"><text variable="container-title" form="short" strip-periods="true"/></if><else><text variable="container-title" strip-periods="true"/></else></choose><choose><if variable="URL"><text term="internet" prefix="[" suffix="]" text-case="capitalize-first"/></if></choose></group><text macro="edition" prefix=" "/></if><else-if type="bill legislation" match="any"><group delimiter=", "><group delimiter=". "><text variable="container-title"/><group delimiter=" "><text term="section" form="short" text-case="capitalize-first"/><text variable="section"/></group></group><text variable="number"/></group></else-if><else-if type="speech">'+
'<group delimiter=": " suffix=";"><group delimiter=" "><text variable="genre" text-case="capitalize-first"/><text term="presented at"/></group><text variable="event"/></group></else-if><else><group delimiter=", " suffix="."><choose><if variable="collection-title" match="none"><group delimiter=" "><label variable="volume" form="short" text-case="capitalize-first"/><text variable="volume"/></group></if></choose><text variable="container-title"/></group></else></choose></macro><macro name="title"><text variable="title"/><choose><if type="article-journal article-magazine chapter paper-conference article-newspaper review review-book entry-dictionary entry-encyclopedia" match="none"><choose><if variable="URL"><text term="internet" prefix=" [" suffix="]" text-case="capitalize-first"/></if></choose><text macro="edition" prefix=". "/></if></choose><choose><if type="thesis"><text variable="genre" prefix=" [" suffix="]"/></if></choose></macro><macro name="edition"><choose><if is-numeric="edition"><group delimiter=" "><number variable="edition" form="ordinal"/><text term="edition" form="short"/></group></if><else><text variable="edition" suffix="."/></else></choose></macro><macro name="date"><choose><if type="article-journal article-magazine article-newspaper review review-book" match="any"><group suffix=";" delimiter=" "><date variable="issued" form="text"/><text macro="accessed-date"/></group></if><else-if type="bill legislation" match="any"><group delimiter=", "><date variable="issued" delimiter=" "><date-part name="month" form="short" strip-periods="true"/><date-part name="day"/></date><date variable="issued"><date-part name="year"/></date></group></else-if><else-if type="report"><date variable="issued" delimiter=" "><date-part name="year"/><date-part name="month" form="short" strip-periods="true"/></date><text macro="accessed-date" prefix=" "/></else-if><else-if type="patent"><group suffix="."><group delimiter=", "><text variable="number"/><date variable="issued"><date-part name="year"/></date></group><text macro="accessed-date" prefix=" "/></group></else-if><else-if type="speech"><group delimiter="; "><group delimiter=" "><date variable="issued" delimiter=" "><date-part name="year"/><date-part name="month" form="short" strip-periods="true"/><date-part name="day"/></date><text macro="accessed-date"/></group><text variable="event-place"/></group></else-if><else><group suffix="."><date variable="issued"><date-part name="year"/></date><text macro="accessed-date" prefix=" "/></group></else></choose></macro><macro name="pages"><choose><if type="article-journal article-magazine article-newspaper review review-book" match="any"><text variable="page" prefix=":"/></if><else-if type="book" match="any"><text variable="number-of-pages" prefix=" "/><choose><if is-numeric="number-of-pages"><label variable="number-of-pages" form="short" prefix=" " plural="never"/></if></choose></else-if><else><group prefix=" " delimiter=" "><label variable="page" form="short" plural="never"/><text variable="page"/></group></else></choose></macro><macro name="journal-location"><choose><if type="article-journal article-magazine review review-book" match="any"><text variable="volume"/><text variable="issue" prefix="(" suffix=")"/></if></choose></macro><macro name="collection-details"><choose><if type="article-journal article-magazine article-newspaper review review-book" match="none"><choose><if variable="collection-title"><group delimiter=" " prefix="(" suffix=")"><names variable="collection-editor" suffix="."><name sort-separator=" " initialize-with="" name-as-sort-order="all" delimiter=", " delimiter-precedes-last="always"/><label form="long" prefix=", "/></names><group delimiter="; "><text variable="collection-title"/><group delimiter=" "><label variable="volume" form="short"/><text variable="volume"/></group></group></group></if></choose></if></choose></macro><macro name="report-details"><choose><if type="report"><text variable="number" prefix="Report No.: "/></if></choose></macro><citation collapse="citation-number">'+
'<sort><key variable="citation-number"/></sort><layout prefix="(" suffix=")" delimiter=","><text variable="citation-number"/></layout></citation><bibliography et-al-min="7" et-al-use-first="6" second-field-align="flush"><layout><text variable="citation-number" suffix=". "/><group delimiter=". " suffix=". "><text macro="author"/><text macro="title"/></group><group delimiter=" " suffix=". "><group delimiter=": "><text macro="chapter-marker"/><group delimiter=" "><text macro="editor"/><text macro="container-title"/></group></group><text macro="publisher"/><group><text macro="date"/><text macro="journal-location"/><text macro="pages"/></group></group><text macro="collection-details" suffix=". "/><text macro="report-details" suffix=". "/><text macro="access"/></layout></bibliography></style>'

}

/**
 * Object containing CSL locales
 * 
 * Locales from the [CSL Project](http://citationstyles.org/)  
 * [REPO](https://github.com/citation-style-language/locales)
 * 
 * Accesed 10/22/2016
 * 
 * @default
 */
var locales = {
  'en-US': '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="en-US"><info><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights><updated>2015-10-10T23:31:02+00:00</updated></info><style-options punctuation-in-quote="true"/><date form="text"><date-part name="month" suffix=" "/><date-part name="day" suffix=", "/><date-part name="year"/></date><date form="numeric"><date-part name="month" form="numeric-leading-zeros" suffix="/"/><date-part name="day" form="numeric-leading-zeros" suffix="/"/><date-part name="year"/></date><terms><term name="accessed">accessed</term><term name="and">and</term><term name="and others">and others</term><term name="anonymous">anonymous</term><term name="anonymous" form="short">anon.</term><term name="at">at</term><term name="available at">available at</term><term name="by">by</term><term name="circa">circa</term><term name="circa" form="short">c.</term><term name="cited">cited</term><term name="edition"><single>edition</single><multiple>editions</multiple></term><term name="edition" form="short">ed.</term><term name="et-al">et al.</term><term name="forthcoming">forthcoming</term><term name="from">from</term><term name="ibid">ibid.</term><term name="in">in</term><term name="in press">in press</term><term name="internet">internet</term><term name="interview">interview</term><term name="letter">letter</term><term name="no date">no date</term><term name="no date" form="short">n.d.</term><term name="online">online</term><term name="presented at">presented at the</term><term name="reference"><single>reference</single><multiple>references</multiple></term><term name="reference" form="short"><single>ref.</single><multiple>refs.</multiple></term><term name="retrieved">retrieved</term><term name="scale">scale</term><term name="version">version</term><term name="ad">AD</term><term name="bc">BC</term><term name="open-quote">“</term><term name="close-quote">”</term><term name="open-inner-quote">‘</term><term name="close-inner-quote">’</term><term name="page-range-delimiter">–</term><term name="ordinal">th</term><term name="ordinal-01">st</term><term name="ordinal-02">nd</term><term name="ordinal-03">rd</term><term name="ordinal-11">th</term><term name="ordinal-12">th</term><term name="ordinal-13">th</term><term name="long-ordinal-01">first</term><term name="long-ordinal-02">second</term><term name="long-ordinal-03">third</term><term name="long-ordinal-04">fourth</term><term name="long-ordinal-05">fifth</term><term name="long-ordinal-06">sixth</term><term name="long-ordinal-07">seventh</term><term name="long-ordinal-08">eighth</term><term name="long-ordinal-09">ninth</term><term name="long-ordinal-10">tenth</term><term name="book"><single>book</single><multiple>books</multiple></term><term name="chapter"><single>chapter</single><multiple>chapters</multiple></term><term name="column"><single>column</single><multiple>columns</multiple></term><term name="figure"><single>figure</single><multiple>figures</multiple></term><term name="folio"><single>folio</single><multiple>folios</multiple></term><term name="issue"><single>number</single><multiple>numbers</multiple></term><term name="line"><single>line</single><multiple>lines</multiple></term><term name="note"><single>note</single><multiple>notes</multiple></term><term name="opus"><single>opus</single><multiple>opera</multiple></term><term name="page"><single>page</single><multiple>pages</multiple></term><term name="number-of-pages"><single>page</single><multiple>pages</multiple></term><term name="paragraph"><single>paragraph</single><multiple>paragraphs</multiple></term><term name="part"><single>part</single><multiple>parts</multiple></term><term name="section"><single>section</single><multiple>sections</multiple></term><term name="sub verbo"><single>sub verbo</single><multiple>sub verbis</multiple></term><term name="verse"><single>verse</single><multiple>verses</multiple>'+
'</term><term name="volume"><single>volume</single><multiple>volumes</multiple></term><term name="book" form="short"><single>bk.</single><multiple>bks.</multiple></term><term name="chapter" form="short"><single>chap.</single><multiple>chaps.</multiple></term><term name="column" form="short"><single>col.</single><multiple>cols.</multiple></term><term name="figure" form="short"><single>fig.</single><multiple>figs.</multiple></term><term name="folio" form="short"><single>fol.</single><multiple>fols.</multiple></term><term name="issue" form="short"><single>no.</single><multiple>nos.</multiple></term><term name="line" form="short"><single>l.</single><multiple>ll.</multiple></term><term name="note" form="short"><single>n.</single><multiple>nn.</multiple></term><term name="opus" form="short"><single>op.</single><multiple>opp.</multiple></term><term name="page" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="number-of-pages" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="paragraph" form="short"><single>para.</single><multiple>paras.</multiple></term><term name="part" form="short"><single>pt.</single><multiple>pts.</multiple></term><term name="section" form="short"><single>sec.</single><multiple>secs.</multiple></term><term name="sub verbo" form="short"><single>s.v.</single><multiple>s.vv.</multiple></term><term name="verse" form="short"><single>v.</single><multiple>vv.</multiple></term><term name="volume" form="short"><single>vol.</single><multiple>vols.</multiple></term><term name="paragraph" form="symbol"><single>¶</single><multiple>¶¶</multiple></term><term name="section" form="symbol"><single>§</single><multiple>§§</multiple></term><term name="director"><single>director</single><multiple>directors</multiple></term><term name="editor"><single>editor</single><multiple>editors</multiple></term><term name="editorial-director"><single>editor</single><multiple>editors</multiple></term><term name="illustrator"><single>illustrator</single><multiple>illustrators</multiple></term><term name="translator"><single>translator</single><multiple>translators</multiple></term><term name="editortranslator"><single>editor &amp; translator</single><multiple>editors &amp; translators</multiple></term><term name="director" form="short"><single>dir.</single><multiple>dirs.</multiple></term><term name="editor" form="short"><single>ed.</single><multiple>eds.</multiple></term><term name="editorial-director" form="short"><single>ed.</single><multiple>eds.</multiple></term><term name="illustrator" form="short"><single>ill.</single><multiple>ills.</multiple></term><term name="translator" form="short"><single>tran.</single><multiple>trans.</multiple></term><term name="editortranslator" form="short"><single>ed. &amp; tran.</single><multiple>eds. &amp; trans.</multiple></term><term name="container-author" form="verb">by</term><term name="director" form="verb">directed by</term><term name="editor" form="verb">edited by</term><term name="editorial-director" form="verb">edited by</term><term name="illustrator" form="verb">illustrated by</term><term name="interviewer" form="verb">interview by</term><term name="recipient" form="verb">to</term><term name="reviewed-author" form="verb">by</term><term name="translator" form="verb">translated by</term><term name="editortranslator" form="verb">edited &amp; translated by</term><term name="director" form="verb-short">dir. by</term><term name="editor" form="verb-short">ed. by</term><term name="editorial-director" form="verb-short">ed. by</term><term name="illustrator" form="verb-short">illus. by</term><term name="translator" form="verb-short">trans. by</term><term name="editortranslator" form="verb-short">ed. &amp; trans. by</term><term name="month-01">January</term><term name="month-02">February</term><term name="month-03">March</term><term name="month-04">April</term><term name="month-05">May</term><term name="month-06">June</term><term name="month-07">July</term><term name="month-08">August</term><term name="month-09">September</term>'+
'<term name="month-10">October</term><term name="month-11">November</term><term name="month-12">December</term><term name="month-01" form="short">Jan.</term><term name="month-02" form="short">Feb.</term><term name="month-03" form="short">Mar.</term><term name="month-04" form="short">Apr.</term><term name="month-05" form="short">May</term><term name="month-06" form="short">Jun.</term><term name="month-07" form="short">Jul.</term><term name="month-08" form="short">Aug.</term><term name="month-09" form="short">Sep.</term><term name="month-10" form="short">Oct.</term><term name="month-11" form="short">Nov.</term><term name="month-12" form="short">Dec.</term><term name="season-01">Spring</term><term name="season-02">Summer</term><term name="season-03">Autumn</term><term name="season-04">Winter</term></terms></locale>'
, 'nl-NL': '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="nl-NL"><info><translator><name>Rintze Zelle</name><uri>http://twitter.com/rintzezelle</uri></translator><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights><updated>2012-07-04T23:31:02+00:00</updated></info><style-options punctuation-in-quote="false"/><date form="text"><date-part name="day" suffix=" "/><date-part name="month" suffix=" "/><date-part name="year"/></date><date form="numeric"><date-part name="day" suffix="-" range-delimiter="/"/><date-part name="month" form="numeric" suffix="-" range-delimiter="/"/><date-part name="year"/></date><terms><term name="accessed">geraadpleegd</term><term name="and">en</term><term name="and others">en anderen</term><term name="anonymous">anoniem</term><term name="anonymous" form="short">anon.</term><term name="at">bij</term><term name="available at">beschikbaar op</term><term name="by">door</term><term name="circa">circa</term><term name="circa" form="short">c.</term><term name="cited">geciteerd</term><term name="edition"><single>editie</single><multiple>edities</multiple></term><term name="edition" form="short">ed.</term><term name="et-al">e.a.</term><term name="forthcoming">in voorbereiding</term><term name="from">van</term><term name="ibid">ibid.</term><term name="in">in</term><term name="in press">in druk</term><term name="internet">internet</term><term name="interview">interview</term><term name="letter">brief</term><term name="no date">zonder datum</term><term name="no date" form="short">z.d.</term><term name="online">online</term><term name="presented at">gepresenteerd bij</term><term name="reference"><single>referentie</single><multiple>referenties</multiple></term><term name="reference" form="short"><single>ref.</single><multiple>refs.</multiple></term><term name="retrieved">geraadpleegd</term><term name="scale">schaal</term><term name="version">versie</term><term name="ad">AD</term><term name="bc">BC</term><term name="open-quote">“</term><term name="close-quote">”</term><term name="open-inner-quote">‘</term><term name="close-inner-quote">’</term><term name="page-range-delimiter">–</term><term name="ordinal">ste</term><term name="ordinal-00" match="whole-number">de</term><term name="ordinal-02" match="last-two-digits">de</term><term name="ordinal-03" match="last-two-digits">de</term><term name="ordinal-04" match="last-two-digits">de</term><term name="ordinal-05" match="last-two-digits">de</term><term name="ordinal-06" match="last-two-digits">de</term><term name="ordinal-07" match="last-two-digits">de</term><term name="ordinal-09" match="last-two-digits">de</term><term name="ordinal-10">de</term><term name="ordinal-11">de</term><term name="ordinal-12">de</term><term name="ordinal-13">de</term><term name="ordinal-14">de</term><term name="ordinal-15">de</term><term name="ordinal-16">de</term><term name="ordinal-17">de</term><term name="ordinal-18">de</term><term name="ordinal-19">de</term><term name="long-ordinal-01">eerste</term><term name="long-ordinal-02">tweede</term><term name="long-ordinal-03">derde</term><term name="long-ordinal-04">vierde</term><term name="long-ordinal-05">vijfde</term><term name="long-ordinal-06">zesde</term><term name="long-ordinal-07">zevende</term><term name="long-ordinal-08">achtste</term><term name="long-ordinal-09">negende</term><term name="long-ordinal-10">tiende</term><term name="book"><single>boek</single><multiple>boeken</multiple></term><term name="chapter"><single>hoofdstuk</single><multiple>hoofdstukken</multiple></term><term name="column"><single>column</single><multiple>columns</multiple></term><term name="figure"><single>figuur</single><multiple>figuren</multiple></term><term name="folio"><single>folio</single><multiple>folio\'s</multiple></term><term name="issue"><single>nummer</single><multiple>nummers</multiple></term><term name="line"><single>regel</single><multiple>regels</multiple>'+
'</term><term name="note"><single>aantekening</single><multiple>aantekeningen</multiple></term><term name="opus"><single>opus</single><multiple>opera</multiple></term><term name="page"><single>pagina</single><multiple>pagina\'s</multiple></term><term name="number-of-pages"><single>pagina</single><multiple>pagina\'s</multiple></term><term name="paragraph"><single>paragraaf</single><multiple>paragrafen</multiple></term><term name="part"><single>deel</single><multiple>delen</multiple></term><term name="section"><single>sectie</single><multiple>secties</multiple></term><term name="sub verbo"><single>sub verbo</single><multiple>sub verbis</multiple></term><term name="verse"><single>vers</single><multiple>versen</multiple></term><term name="volume"><single>volume</single><multiple>volumes</multiple></term><term name="book" form="short">bk.</term><term name="chapter" form="short">hfdst.</term><term name="column" form="short">col.</term><term name="figure" form="short">fig.</term><term name="folio" form="short">f.</term><term name="issue" form="short">nr.</term><term name="line" form="short">l.</term><term name="note" form="short">n.</term><term name="opus" form="short">op.</term><term name="page" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="number-of-pages" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="paragraph" form="short">par.</term><term name="part" form="short">deel</term><term name="section" form="short">sec.</term><term name="sub verbo" form="short"><single>s.v.</single><multiple>s.vv.</multiple></term><term name="verse" form="short"><single>v.</single><multiple>vv.</multiple></term><term name="volume" form="short"><single>vol.</single><multiple>vols.</multiple></term><term name="paragraph" form="symbol"><single>¶</single><multiple>¶¶</multiple></term><term name="section" form="symbol"><single>§</single><multiple>§§</multiple></term><term name="director"><single>regisseur</single><multiple>regisseurs</multiple></term><term name="editor"><single>redacteur</single><multiple>redacteuren</multiple></term><term name="editorial-director"><single>redacteur</single><multiple>redacteuren</multiple></term><term name="illustrator"><single>illustrator</single><multiple>illustrators</multiple></term><term name="translator"><single>vertaler</single><multiple>vertalers</multiple></term><term name="editortranslator"><single>redacteur &amp; vertaler</single><multiple>redacteuren &amp; vertalers</multiple></term><term name="director" form="short"><single>reg.</single><multiple>reg.</multiple></term><term name="editor" form="short"><single>red.</single><multiple>red.</multiple></term><term name="editorial-director" form="short"><single>red.</single><multiple>red.</multiple></term><term name="illustrator" form="short"><single>ill.</single><multiple>ill.</multiple></term><term name="translator" form="short"><single>vert.</single><multiple>vert.</multiple></term><term name="editortranslator" form="short"><single>red. &amp; vert.</single><multiple>red. &amp; vert.</multiple></term><term name="container-author" form="verb">door</term><term name="director" form="verb">geregisseerd door</term><term name="editor" form="verb">bewerkt door</term><term name="editorial-director" form="verb">bewerkt door</term><term name="illustrator" form="verb">geïllustreerd door</term><term name="interviewer" form="verb">geïnterviewd door</term><term name="recipient" form="verb">ontvangen door</term><term name="reviewed-author" form="verb">door</term><term name="translator" form="verb">vertaald door</term><term name="editortranslator" form="verb">bewerkt &amp; vertaald door</term><term name="director" form="verb-short">geregisseerd door</term><term name="editor" form="verb-short">bewerkt door</term><term name="editorial-director" form="verb-short">bewerkt door</term><term name="illustrator" form="verb-short">geïllustreerd door</term><term name="translator" form="verb-short">vertaald door</term><term name="editortranslator" form="verb-short">bewerkt &amp; vertaald door</term>'+
'<term name="month-01">januari</term><term name="month-02">februari</term><term name="month-03">maart</term><term name="month-04">april</term><term name="month-05">mei</term><term name="month-06">juni</term><term name="month-07">juli</term><term name="month-08">augustus</term><term name="month-09">september</term><term name="month-10">oktober</term><term name="month-11">november</term><term name="month-12">december</term><term name="month-01" form="short">jan.</term><term name="month-02" form="short">feb.</term><term name="month-03" form="short">mrt.</term><term name="month-04" form="short">apr.</term><term name="month-05" form="short">mei</term><term name="month-06" form="short">jun.</term><term name="month-07" form="short">jul.</term><term name="month-08" form="short">aug.</term><term name="month-09" form="short">sep.</term><term name="month-10" form="short">okt.</term><term name="month-11" form="short">nov.</term><term name="month-12" form="short">dec.</term><term name="season-01">lente</term><term name="season-02">zomer</term><term name="season-03">herst</term><term name="season-04">winter</term></terms></locale>'
, 'fr-FR': '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="fr-FR"><info><translator><name>Grégoire Colly</name></translator><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights><updated>2012-07-04T23:31:02+00:00</updated></info><style-options punctuation-in-quote="false" limit-day-ordinals-to-day-1="true"/><date form="text"><date-part name="day" suffix=" "/><date-part name="month" suffix=" "/><date-part name="year"/></date><date form="numeric"><date-part name="day" form="numeric-leading-zeros" suffix="/"/><date-part name="month" form="numeric-leading-zeros" suffix="/"/><date-part name="year"/></date><terms><term name="accessed">consulté le</term><term name="and">et</term><term name="and others">et autres</term><term name="anonymous">anonyme</term><term name="anonymous" form="short">anon.</term><term name="at">sur</term><term name="available at">disponible sur</term><term name="by">par</term><term name="circa">vers</term><term name="circa" form="short">v.</term><term name="cited">cité</term><term name="edition" gender="feminine"><single>édition</single><multiple>éditions</multiple></term><term name="edition" form="short">éd.</term><term name="et-al">et al.</term><term name="forthcoming">à paraître</term><term name="from">à l\'adresse</term><term name="ibid">ibid.</term><term name="in">in</term><term name="in press">sous presse</term><term name="internet">Internet</term><term name="interview">entretien</term><term name="letter">lettre</term><term name="no date">sans date</term><term name="no date" form="short">s.&#160;d.</term><term name="online">en ligne</term><term name="presented at">présenté à</term><term name="reference"><single>référence</single><multiple>références</multiple></term><term name="reference" form="short"><single>réf.</single><multiple>réf.</multiple></term><term name="retrieved">consulté</term><term name="scale">échelle</term><term name="version">version</term><term name="ad">apr. J.-C.</term><term name="bc">av. J.-C.</term><term name="open-quote">«&#160;</term><term name="close-quote">&#160;»</term><term name="open-inner-quote">“</term><term name="close-inner-quote">”</term><term name="page-range-delimiter">&#8209;</term><term name="ordinal">ᵉ</term><term name="ordinal-01" gender-form="feminine" match="whole-number">ʳᵉ</term><term name="ordinal-01" gender-form="masculine" match="whole-number">ᵉʳ</term><term name="long-ordinal-01">premier</term><term name="long-ordinal-02">deuxième</term><term name="long-ordinal-03">troisième</term><term name="long-ordinal-04">quatrième</term><term name="long-ordinal-05">cinquième</term><term name="long-ordinal-06">sixième</term><term name="long-ordinal-07">septième</term><term name="long-ordinal-08">huitième</term><term name="long-ordinal-09">neuvième</term><term name="long-ordinal-10">dixième</term><term name="book"><single>livre</single><multiple>livres</multiple></term><term name="chapter"><single>chapitre</single><multiple>chapitres</multiple></term><term name="column"><single>colonne</single><multiple>colonnes</multiple></term><term name="figure"><single>figure</single><multiple>figures</multiple></term><term name="folio"><single>folio</single><multiple>folios</multiple></term><term name="issue" gender="masculine"><single>numéro</single><multiple>numéros</multiple></term><term name="line"><single>ligne</single><multiple>lignes</multiple></term><term name="note"><single>note</single><multiple>notes</multiple></term><term name="opus"><single>opus</single><multiple>opus</multiple></term><term name="page"><single>page</single><multiple>pages</multiple></term><term name="number-of-pages"><single>page</single><multiple>pages</multiple></term><term name="paragraph"><single>paragraphe</single><multiple>paragraphes</multiple></term><term name="part"><single>partie</single><multiple>parties</multiple></term><term name="section"><single>section</single><multiple>sections</multiple>'+
'</term><term name="sub verbo"><single>sub verbo</single><multiple>sub verbis</multiple></term><term name="verse"><single>verset</single><multiple>versets</multiple></term><term name="volume" gender="masculine"><single>volume</single><multiple>volumes</multiple></term><term name="book" form="short">liv.</term><term name="chapter" form="short">chap.</term><term name="column" form="short">col.</term><term name="figure" form="short">fig.</term><term name="folio" form="short"><single>fᵒ</single><multiple>fᵒˢ</multiple></term><term name="issue" form="short"><single>nᵒ</single><multiple>nᵒˢ</multiple></term><term name="line" form="short">l.</term><term name="note" form="short">n.</term><term name="opus" form="short">op.</term><term name="page" form="short"><single>p.</single><multiple>p.</multiple></term><term name="number-of-pages" form="short"><single>p.</single><multiple>p.</multiple></term><term name="paragraph" form="short">paragr.</term><term name="part" form="short">part.</term><term name="section" form="short">sect.</term><term name="sub verbo" form="short"><single>s.&#160;v.</single><multiple>s.&#160;vv.</multiple></term><term name="verse" form="short"><single>v.</single><multiple>v.</multiple></term><term name="volume" form="short"><single>vol.</single><multiple>vol.</multiple></term><term name="paragraph" form="symbol"><single>§</single><multiple>§</multiple></term><term name="section" form="symbol"><single>§</single><multiple>§</multiple></term><term name="director"><single>réalisateur</single><multiple>réalisateurs</multiple></term><term name="editor"><single>éditeur</single><multiple>éditeurs</multiple></term><term name="editorial-director"><single>directeur</single><multiple>directeurs</multiple></term><term name="illustrator"><single>illustrateur</single><multiple>illustrateurs</multiple></term><term name="translator"><single>traducteur</single><multiple>traducteurs</multiple></term><term name="editortranslator"><single>éditeur et traducteur</single><multiple>éditeurs et traducteurs</multiple></term><term name="director" form="short"><single>réal.</single><multiple>réal.</multiple></term><term name="editor" form="short"><single>éd.</single><multiple>éd.</multiple></term><term name="editorial-director" form="short"><single>dir.</single><multiple>dir.</multiple></term><term name="illustrator" form="short"><single>ill.</single><multiple>ill.</multiple></term><term name="translator" form="short"><single>trad.</single><multiple>trad.</multiple></term><term name="editortranslator" form="short"><single>éd. et trad.</single><multiple>éd. et trad.</multiple></term><term name="container-author" form="verb">par</term><term name="director" form="verb">réalisé par</term><term name="editor" form="verb">édité par</term><term name="editorial-director" form="verb">sous la direction de</term><term name="illustrator" form="verb">illustré par</term><term name="interviewer" form="verb">entretien réalisé par</term><term name="recipient" form="verb">à</term><term name="reviewed-author" form="verb">par</term><term name="translator" form="verb">traduit par</term><term name="editortranslator" form="verb">édité et traduit par</term><term name="director" form="verb-short">réal. par</term><term name="editor" form="verb-short">éd. par</term><term name="editorial-director" form="verb-short">ss la dir. de</term><term name="illustrator" form="verb-short">ill. par</term><term name="translator" form="verb-short">trad. par</term><term name="editortranslator" form="verb-short">éd. et trad. par</term><term name="month-01" gender="masculine">janvier</term><term name="month-02" gender="masculine">février</term><term name="month-03" gender="masculine">mars</term><term name="month-04" gender="masculine">avril</term><term name="month-05" gender="masculine">mai</term><term name="month-06" gender="masculine">juin</term><term name="month-07" gender="masculine">juillet</term><term name="month-08" gender="masculine">août</term><term name="month-09" gender="masculine">septembre</term><term name="month-10" gender="masculine">'+
'octobre</term><term name="month-11" gender="masculine">novembre</term><term name="month-12" gender="masculine">décembre</term><term name="month-01" form="short">janv.</term><term name="month-02" form="short">févr.</term><term name="month-03" form="short">mars</term><term name="month-04" form="short">avr.</term><term name="month-05" form="short">mai</term><term name="month-06" form="short">juin</term><term name="month-07" form="short">juill.</term><term name="month-08" form="short">août</term><term name="month-09" form="short">sept.</term><term name="month-10" form="short">oct.</term><term name="month-11" form="short">nov.</term><term name="month-12" form="short">déc.</term><term name="season-01">printemps</term><term name="season-02">été</term><term name="season-03">automne</term><term name="season-04">hiver</term></terms></locale>'
, 'de-DE': '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="de-DE"><info><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights><updated>2012-07-04T23:31:02+00:00</updated></info><style-options punctuation-in-quote="false"/><date form="text"><date-part name="day" form="ordinal" suffix=" "/><date-part name="month" suffix=" "/><date-part name="year"/></date><date form="numeric"><date-part name="day" form="numeric-leading-zeros" suffix="."/><date-part name="month" form="numeric-leading-zeros" suffix="."/><date-part name="year"/></date><terms><term name="accessed">zugegriffen</term><term name="and">und</term><term name="and others">und andere</term><term name="anonymous">ohne Autor</term><term name="anonymous" form="short">o.&#160;A.</term><term name="at">auf</term><term name="available at">verfügbar unter</term><term name="by">von</term><term name="circa">circa</term><term name="circa" form="short">ca.</term><term name="cited">zitiert</term><term name="edition"><single>Auflage</single><multiple>Auflagen</multiple></term><term name="edition" form="short">Aufl.</term><term name="et-al">u.&#160;a.</term><term name="forthcoming">i.&#160;E.</term><term name="from">von</term><term name="ibid">ebd.</term><term name="in">in</term><term name="in press">im Druck</term><term name="internet">Internet</term><term name="interview">Interview</term><term name="letter">Brief</term><term name="no date">ohne Datum</term><term name="no date" form="short">o.&#160;J.</term><term name="online">online</term><term name="presented at">gehalten auf der</term><term name="reference"><single>Referenz</single><multiple>Referenzen</multiple></term><term name="reference" form="short"><single>Ref.</single><multiple>Ref.</multiple></term><term name="retrieved">abgerufen</term><term name="scale">Maßstab</term><term name="version">Version</term><term name="ad">n.&#160;Chr.</term><term name="bc">v.&#160;Chr.</term><term name="open-quote">„</term><term name="close-quote">“</term><term name="open-inner-quote">‚</term><term name="close-inner-quote">‘</term><term name="page-range-delimiter">–</term><term name="ordinal">.</term><term name="long-ordinal-01">erster</term><term name="long-ordinal-02">zweiter</term><term name="long-ordinal-03">dritter</term><term name="long-ordinal-04">vierter</term><term name="long-ordinal-05">fünfter</term><term name="long-ordinal-06">sechster</term><term name="long-ordinal-07">siebter</term><term name="long-ordinal-08">achter</term><term name="long-ordinal-09">neunter</term><term name="long-ordinal-10">zehnter</term><term name="book"><single>Buch</single><multiple>Bücher</multiple></term><term name="chapter"><single>Kapitel</single><multiple>Kapitel</multiple></term><term name="column"><single>Spalte</single><multiple>Spalten</multiple></term><term name="figure"><single>Abbildung</single><multiple>Abbildungen</multiple></term><term name="folio"><single>Blatt</single><multiple>Blätter</multiple></term><term name="issue"><single>Nummer</single><multiple>Nummern</multiple></term><term name="line"><single>Zeile</single><multiple>Zeilen</multiple></term><term name="note"><single>Note</single><multiple>Noten</multiple></term><term name="opus"><single>Opus</single><multiple>Opera</multiple></term><term name="page"><single>Seite</single><multiple>Seiten</multiple></term><term name="number-of-pages"><single>Seite</single><multiple>Seiten</multiple></term><term name="paragraph"><single>Absatz</single><multiple>Absätze</multiple></term><term name="part"><single>Teil</single><multiple>Teile</multiple></term><term name="section"><single>Abschnitt</single><multiple>Abschnitte</multiple></term><term name="sub verbo"><single>sub verbo</single><multiple>sub verbis</multiple></term><term name="verse"><single>Vers</single><multiple>Verse</multiple></term><term name="volume"><single>Band</single><multiple>Bände</multiple></term><term name="book" form="short">B.</term>'+
'<term name="chapter" form="short">Kap.</term><term name="column" form="short">Sp.</term><term name="figure" form="short">Abb.</term><term name="folio" form="short">Fol.</term><term name="issue" form="short">Nr.</term><term name="line" form="short">Z.</term><term name="note" form="short">N.</term><term name="opus" form="short">op.</term><term name="page" form="short"><single>S.</single><multiple>S.</multiple></term><term name="number-of-pages" form="short"><single>S.</single><multiple>S.</multiple></term><term name="paragraph" form="short">Abs.</term><term name="part" form="short">Teil</term><term name="section" form="short">Abschn.</term><term name="sub verbo" form="short"><single>s.&#160;v.</single><multiple>s.&#160;vv.</multiple></term><term name="verse" form="short"><single>V.</single><multiple>V.</multiple></term><term name="volume" form="short"><single>Bd.</single><multiple>Bde.</multiple></term><term name="paragraph" form="symbol"><single>¶</single><multiple>¶¶</multiple></term><term name="section" form="symbol"><single>§</single><multiple>§§</multiple></term><term name="director"><single>Regisseur</single><multiple>Regisseure</multiple></term><term name="editor"><single>Herausgeber</single><multiple>Herausgeber</multiple></term><term name="collection-editor"><single>Reihenherausgeber</single><multiple>Reihenherausgeber</multiple></term><term name="editorial-director"><single>Herausgeber</single><multiple>Herausgeber</multiple></term><term name="illustrator"><single>Illustrator</single><multiple>Illustratoren</multiple></term><term name="translator"><single>Übersetzer</single><multiple>Übersetzer</multiple></term><term name="editortranslator"><single>Herausgeber&#160;&amp; Übersetzer</single><multiple>Herausgeber&#160;&amp; Übersetzer</multiple></term><term name="director" form="short"><single>Reg.</single><multiple>Reg.</multiple></term><term name="editor" form="short"><single>Hrsg.</single><multiple>Hrsg.</multiple></term><term name="collection-editor" form="short"><single>Hrsg.</single><multiple>Hrsg.</multiple></term><term name="editorial-director" form="short"><single>Hrsg.</single><multiple>Hrsg.</multiple></term><term name="illustrator" form="short"><single>Ill.</single><multiple>Ill.</multiple></term><term name="translator" form="short"><single>Übers.</single><multiple>Übers.</multiple></term><term name="editortranslator" form="short"><single>Hrsg.&#160;&amp; Übers.</single><multiple>Hrsg.&#160;&amp; Übers</multiple></term><term name="container-author" form="verb">von</term><term name="director" form="verb">Regie von</term><term name="editor" form="verb">herausgegeben von</term><term name="collection-editor" form="verb">herausgegeben von</term><term name="editorial-director" form="verb">herausgegeben von</term><term name="illustrator" form="verb">illustriert von</term><term name="interviewer" form="verb">interviewt von</term><term name="recipient" form="verb">an</term><term name="reviewed-author" form="verb">von</term><term name="translator" form="verb">übersetzt von</term><term name="editortranslator" form="verb">herausgegeben und übersetzt von</term><term name="director" form="verb-short">Reg.</term><term name="editor" form="verb-short">hg. von</term><term name="collection-editor" form="verb-short">hg. von</term><term name="editorial-director" form="verb-short">hg. von</term><term name="illustrator" form="verb-short">illus. von</term><term name="translator" form="verb-short">übers. von</term><term name="editortranslator" form="verb-short">hg.&#160;&amp; übers. von</term><term name="month-01">Januar</term><term name="month-02">Februar</term><term name="month-03">März</term><term name="month-04">April</term><term name="month-05">Mai</term><term name="month-06">Juni</term><term name="month-07">Juli</term><term name="month-08">August</term><term name="month-09">September</term><term name="month-10">Oktober</term><term name="month-11">November</term><term name="month-12">Dezember</term><term name="month-01" form="short">Jan.</term><term name="month-02" form="short">Feb.</term>'+
'<term name="month-03" form="short">März</term><term name="month-04" form="short">Apr.</term><term name="month-05" form="short">Mai</term><term name="month-06" form="short">Juni</term><term name="month-07" form="short">Juli</term><term name="month-08" form="short">Aug.</term><term name="month-09" form="short">Sep.</term><term name="month-10" form="short">Okt.</term><term name="month-11" form="short">Nov.</term><term name="month-12" form="short">Dez.</term><term name="season-01">Frühjahr</term><term name="season-02">Sommer</term><term name="season-03">Herbst</term><term name="season-04">Winter</term></terms></locale>'
, 'es-ES': '<?xml version="1.0" encoding="utf-8"?><locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="es-ES"><info><rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights><updated>2012-07-04T23:31:02+00:00</updated></info><style-options punctuation-in-quote="false"/><date form="text"><date-part name="day" suffix=" de "/><date-part name="month" suffix=" de "/><date-part name="year"/></date><date form="numeric"><date-part name="day" form="numeric-leading-zeros" suffix="/"/><date-part name="month" form="numeric-leading-zeros" suffix="/"/><date-part name="year"/></date><terms><term name="accessed">accedido</term><term name="and">y</term><term name="and others">y otros</term><term name="anonymous">anónimo</term><term name="anonymous" form="short">anón.</term><term name="at">en</term><term name="available at">disponible en</term><term name="by">de</term><term name="circa">circa</term><term name="circa" form="short">c.</term><term name="cited">citado</term><term name="edition"><single>edición</single><multiple>ediciones</multiple></term><term name="edition" form="short">ed.</term><term name="et-al">et&#160;al.</term><term name="forthcoming">previsto</term><term name="from">a partir de</term><term name="ibid">ibid.</term><term name="in">en</term><term name="in press">en imprenta</term><term name="internet">internet</term><term name="interview">entrevista</term><term name="letter">carta</term><term name="no date">sin fecha</term><term name="no date" form="short">s.&#160;f.</term><term name="online">en línea</term><term name="presented at">presentado en</term><term name="reference"><single>referencia</single><multiple>referencias</multiple></term><term name="reference" form="short"><single>ref.</single><multiple>refs.</multiple></term><term name="retrieved">recuperado</term><term name="scale">escala</term><term name="version">versión</term><term name="ad">d.&#160;C.</term><term name="bc">a.&#160;C.</term><term name="open-quote">«</term><term name="close-quote">»</term><term name="open-inner-quote">“</term><term name="close-inner-quote">”</term><term name="page-range-delimiter">-</term><term name="ordinal">.ª</term><term name="long-ordinal-01">primera</term><term name="long-ordinal-02">segunda</term><term name="long-ordinal-03">tercera</term><term name="long-ordinal-04">cuarta</term><term name="long-ordinal-05">quinta</term><term name="long-ordinal-06">sexta</term><term name="long-ordinal-07">séptima</term><term name="long-ordinal-08">octava</term><term name="long-ordinal-09">novena</term><term name="long-ordinal-10">décima</term><term name="book"><single>libro</single><multiple>libros</multiple></term><term name="chapter"><single>capítulo</single><multiple>capítulos</multiple></term><term name="column"><single>columna</single><multiple>columnas</multiple></term><term name="figure"><single>figura</single><multiple>figuras</multiple></term><term name="folio"><single>folio</single><multiple>folios</multiple></term><term name="issue"><single>número</single><multiple>números</multiple></term><term name="line"><single>línea</single><multiple>líneas</multiple></term><term name="note"><single>nota</single><multiple>notas</multiple></term><term name="opus"><single>opus</single><multiple>opera</multiple></term><term name="page"><single>página</single><multiple>páginas</multiple></term><term name="number-of-pages"><single>página</single><multiple>páginas</multiple></term><term name="paragraph"><single>párrafo</single><multiple>párrafos</multiple></term><term name="part"><single>parte</single><multiple>partes</multiple></term><term name="section"><single>sección</single><multiple>secciones</multiple></term><term name="sub verbo"><single>sub voce</single><multiple>sub vocibus</multiple></term><term name="verse"><single>verso</single><multiple>versos</multiple></term><term name="volume"><single>volumen</single><multiple>volúmenes</multiple></term><term name="book" form="short">lib.</term>'+
'<term name="chapter" form="short">cap.</term><term name="column" form="short">col.</term><term name="figure" form="short">fig.</term><term name="folio" form="short">f.</term><term name="issue" form="short">n.º</term><term name="line" form="short">l.</term><term name="note" form="short">n.</term><term name="opus" form="short">op.</term><term name="page" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="number-of-pages" form="short"><single>p.</single><multiple>pp.</multiple></term><term name="paragraph" form="short">párr.</term><term name="part" form="short">pt.</term><term name="section" form="short">sec.</term><term name="sub verbo" form="short"><single>s.&#160;v.</single><multiple>s.&#160;vv.</multiple></term><term name="verse" form="short"><single>v.</single><multiple>vv.</multiple></term><term name="volume" form="short"><single>vol.</single><multiple>vols.</multiple></term><term name="paragraph" form="symbol"><single>§</single><multiple>§</multiple></term><term name="section" form="symbol"><single>§</single><multiple>§</multiple></term><term name="director"><single>director</single><multiple>directores</multiple></term><term name="editor"><single>editor</single><multiple>editores</multiple></term><term name="editorial-director"><single>editor</single><multiple>editores</multiple></term><term name="illustrator"><single>ilustrador</single><multiple>ilustradores</multiple></term><term name="translator"><single>traductor</single><multiple>traductores</multiple></term><term name="editortranslator"><single>editor y traductor</single><multiple>editores y traductores</multiple></term><term name="director" form="short"><single>dir.</single><multiple>dirs.</multiple></term><term name="editor" form="short"><single>ed.</single><multiple>eds.</multiple></term><term name="editorial-director" form="short"><single>ed.</single><multiple>eds.</multiple></term><term name="illustrator" form="short"><single>ilust.</single><multiple>ilusts.</multiple></term><term name="translator" form="short"><single>trad.</single><multiple>trads.</multiple></term><term name="editortranslator" form="short"><single>ed. y trad.</single><multiple>eds. y trads.</multiple></term><term name="container-author" form="verb">de</term><term name="director" form="verb">dirigido por</term><term name="editor" form="verb">editado por</term><term name="editorial-director" form="verb">editado por</term><term name="illustrator" form="verb">ilustrado por</term><term name="interviewer" form="verb">entrevistado por</term><term name="recipient" form="verb">a</term><term name="reviewed-author" form="verb">por</term><term name="translator" form="verb">traducido por</term><term name="editortranslator" form="verb">editado y traducido por</term><term name="director" form="verb-short">dir.</term><term name="editor" form="verb-short">ed.</term><term name="editorial-director" form="verb-short">ed.</term><term name="illustrator" form="verb-short">ilust.</term><term name="translator" form="verb-short">trad.</term><term name="editortranslator" form="verb-short">ed. y trad.</term><term name="month-01">enero</term><term name="month-02">febrero</term><term name="month-03">marzo</term><term name="month-04">abril</term><term name="month-05">mayo</term><term name="month-06">junio</term><term name="month-07">julio</term><term name="month-08">agosto</term><term name="month-09">septiembre</term><term name="month-10">octubre</term><term name="month-11">noviembre</term><term name="month-12">diciembre</term><term name="month-01" form="short">ene.</term><term name="month-02" form="short">feb.</term><term name="month-03" form="short">mar.</term><term name="month-04" form="short">abr.</term><term name="month-05" form="short">may</term><term name="month-06" form="short">jun.</term><term name="month-07" form="short">jul.</term><term name="month-08" form="short">ago.</term><term name="month-09" form="short">sep.</term><term name="month-10" form="short">oct.</term><term name="month-11" form="short">nov.</term><term name="month-12" form="short">'+
'dic.</term><term name="season-01">primavera</term><term name="season-02">verano</term><term name="season-03">otoño</term><term name="season-04">invierno</term></terms></locale>'
}

/**
 * Retrieve CSL locale
 * 
 * @method retrieveLocale
 * 
 * @param lang lang code
 * @return CSL locale
 */
var retrieveLocale = function ( lang ) {
  return locales[ lang ]
}

/**
 * Object containing a list of Wikidata Instances and it's corresponding name as specified by the docs
 * 
 * @default
 */
var wikidataInstances = {
  Q13442814: 'article-journal'
, Q18918145: 'article-journal'
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
	output = output.concat( parseInput( value ) )
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

 var Cite = function Cite (data,options) {

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
    + ( src.author && src.author.length ? src.author[ 0 ].family || src.author[ 0 ].literal : '' )
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
  * @param {String} [options.lang="en-US"] - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
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
	      , CSLTemplates.hasOwnProperty( style ) ? CSLTemplates[ style ] : CSLTemplates[ 'apa' ]
	      , locales.hasOwnProperty( options.lang ) ? options.lang : 'en-US'
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
	    
	    result  = ''
	    result += '<ul style="list-style-type:none">'
	    
	    for ( var i = 0; i < this.data.length; i++ ) {
	      
	      var src = this.data[ i ]
	        , pubType = (src.type||'').toLowerCase()
	    
	      result += '<li>';
	      result += '@' + getBibTeXType( pubType ) + '{' + this.getLabel( i ) + ','
	      result += '<ul style="list-style-type:none">';
	      
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
	      result += '</ul>}</li>';
	      
	    }
	    
	    result += '</ul>'
	    
	    break;
	}
	
        break;
      
      case 'string':
	
	var options = Object.assign( {}, options, {type:'html'} )
	
	result = striptag( this.get( options, true ) )
	
	break;
      
      case 'json':
	
	switch ( options.style.toLowerCase().split( '-' )[ 0 ] ) {
	  case 'csl':
	    
	    result = JSON.stringify( this.data )
	    
	    break;
	  
	  case 'bibtex':
	    
	    var self = this
	    
	    result = JSON.stringify( this.data.slice().map( function ( props, index ) {
	    
	      var obj   = {}
	      
	      obj.label = self.getLabel( index )
	      obj.type  = getBibTeXType( props.type )
	      obj.properties = props
	      
	      for ( var prop in props ) {
		if ( [
		  'author'
		, 'organization'
		, 'note'
		, 'doi'
		, 'editor'
		, 'isbn'
		, 'issn'
		, 'journal'
		, 'issue'
		, 'pages'
		, 'address'
		, 'edition'
		, 'publisher'
		, 'title'
		, 'url'
		, 'volume'
		, 'year'
		].indexOf( prop ) === -1 )
		
		delete obj.properties[ prop ]
	      }
	      
	      console.log(obj)
	      
	      return obj
	    
	    } ) )
	    
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

return Cite

})(
  ( typeof window   !== 'undefined' ? window : null )
, ( typeof require  === 'function'  ? {
    CSL: require( './node.citeproc.js' ).CSL
  , striptags : require( 'striptags' )
  } : {
    CSL: CSL
  , striptags: function ( html ) {
      var tmp = document.createElement( 'div' )
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }
  } )
, ( typeof process  !== 'undefined' && typeof global   !== 'undefined' )
, ( typeof location !== 'undefined' && typeof document !== 'undefined' )
)

if ( typeof require  === 'function' )
  require( 'module' ),
  module.exports = Cite