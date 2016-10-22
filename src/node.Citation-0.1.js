/** 
 * @file node.Citation-0.1.js
 * 
 * @description
 * # Description
 *
 * A Node.js program to call Citationjs from the commandline.
 * 
 * # Use
 * 
 *    Usage: node.Citation-0.1 [options]
 *  
 *    Options:
 *  
 *      -h, --help                      output usage information
 *      -V, --version                   output the version number
 *      -i, --input <path>              Input file
 *      -u, --url <url>                 Input url
 *      -o, --output <path>             Output file (omit file extension)
 *      -R, --non-real                  Do not output the file in its mime type, but as a string
 *      -f, --output-format <option>    Output structure format: string, html, json.
 *      -s, --output-style <option>     Ouput scheme. A combination of --output-format json and --output-style citation-* is considered invalid. Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)
 *      -l, --output-language <option>  Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
 * 
 * # Dependencies
 * 
 * * Citation-0.1.js
 * * wikidata.Citation-0.1.js
 * * Node.js and following packages:
 *   * commander
 *   * striptags
 *   * fs
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

var program = require(   'commander'       )
  , fs      = require(   'fs'              )
  , striptag= require(   'striptags'       )
  , Cite    = require( './Citation-0.1.js' )
  , wdCite  = require( './wikidata.Citation-0.1.js' )

program
  .version( '0.1' )
  .usage  ( '[options]' )
  
  .option ( '-i, --input <path>',
	    'Input file')
  .option ( '-u, --url <url>',
	    'Input url')
  .option ( '-o, --output <path>',
	    'Output file (omit file extension)')
  
  .option ( '-R, --non-real',
	    'Do not output the file in its mime type, but as a string',
	    false )
  .option ( '-f, --output-format <option>',
	    'Output structure format: string, html, json.',
	    'json' )
  .option ( '-s, --output-style <option>',
	    'Ouput scheme. A combination of --output-format json and --output-style citation-* is considered invalid. ' +
	    'Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)',
	    'csl' )
  .option ( '-l, --output-language <option>',
	    'Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes',
	    'en' )
  
  .parse  ( process.argv )

if ( !process.argv.slice(2).length )
  program.help()

// Validating arguments

if ( !( program.input || program.url ) ) {
  console.log( 'Please give argument input or url' )
  process.exit( 1 ) }

if ( !program.output ) {
  console.log( 'Please give argument output' )
  process.exit( 1 ) }

if ( !fs.existsSync( program.input ) && program.input ) {
  console.log( 'Input file does not exist: ' + program.input )
  process.exit( 1 ) }

// End

var input

if ( program.input )
  input = fs.readFileSync( program.input, 'utf8' )
else if ( program.url )
  input = program.url

if ( input.match(
  /((https?:\/\/www.wikidata.org\/entity\/)?Q\d+(\s+|,))*(https?:\/\/www.wikidata.org\/entity\/)?Q\d+/
) ) input = wdCite( input.split( /\s+|,/ ), program.outputLanguage )

var data  = new Cite( input )
  , options = {
    format: 'string',
    type: program.outputFormat,
    style: program.outputStyle,
    lan: program.outputLanguage
  }
  , extension = ( program.outputStyle === 'bibtex' ) ? '.bib' : ( '.' + {
    string: 'txt',
    html: 'html',
    json: 'json'
  }[ program.outputMimeType ] )
  , output = data.get( options )

if ( program.outputFormat === 'string' )
  output = striptag( output )

fs.writeFileSync( program.output + extension, output )