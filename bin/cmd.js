#!/usr/bin/env node

/** 
 * @file cmd.js
 * 
 * @projectname Citation.js
 * 
 * @author Lars Willighagen
 * @version 0.2.15
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

var program = require( 'commander'       )
  , fs      = require( 'fs'              )
  , Cite    = require( '../index.js' )

console.debug = console.log

/*-------- Program ---------*/
program
  .version( '0.2.15' )
  .usage  ( '[options]' )
  
  .option ( '-i, --input <path>',
            'Input file')
  .option ( '-u, --url <url>',
            'Input url')
  .option ( '-t, --text <string>',
            'Input text')
  
  .option ( '-o, --output <path>',
            'Output file (omit file extension)')
  
  .option ( '-R, --output-non-real',
            'Do not output the file in its mime type, but as a string',
            false )
  .option ( '-f, --output-type <option>',
            'Output structure type: string, html, json',
            'json' )
  .option ( '-s, --output-style <option>',
            'Ouput scheme. A combination of --output-format json and --output-style citation-* is considered invalid. ' +
            'Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)',
            'csl' )
  .option ( '-l, --output-language <option>',
            'Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes',
            'en-US' )
  
  .parse  ( process.argv )

if ( !process.argv.slice(2).length )
  program.help()
/*--------------------------*/

/*-- Validating arguments --*/
if ( !( program.input || program.url || program.text ) ) {
  console.log( 'Please give argument input file, url or text' )
  process.exit( 1 ) }

if ( !program.output ) {
  console.log( 'Please give argument output' )
  process.exit( 1 ) }

if ( !fs.existsSync( program.input ) && program.input ) {
  console.log( 'Input file does not exist: ' + program.input )
  process.exit( 1 ) }
/*--------------------------*/

/*---------- Input ---------*/
var input

if ( program.input )
  input = fs.readFileSync( program.input, 'utf8' )
else if ( program.url || program.text )
  input = program.url || program.text
/*--------------------------*/

/*--------- Output ---------*/
var data = new Cite( input )
  , options = {
    format: 'string' ,
    type: program.outputType,
    style: program.outputStyle,
    lan: program.outputLanguage
  }
  , output = data.get( options )

if ( !program.outputNonReal && program.outputType === 'html' )
  output = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + output + '</body></html>'
/*--------------------------*/

/*-------- Extension -------*/
var extension

if ( program.outputStyle === 'bibtex' && program.outputType === 'string' )
  extension = '.bib'

else if ( program.outputNonReal )
  extension = '.txt'

else
  extension = ( '.' + {
    string: 'txt',
    html: 'html',
    json: 'json'
  }[ program.outputType ] )
/*--------------------------*/

fs.writeFileSync( program.output + extension, output )