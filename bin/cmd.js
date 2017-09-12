#!/usr/bin/env node

/**
 * @file cmd.js
 *
 * @projectname Citation.js
 *
 * @author Lars Willighagen
 * @version 0.3.0-13
 * @license
 * Copyright (c) 2016-2017 Lars Willighagen
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

var program = require('commander')
var fs = require('fs')
var path = require('path')
var cjs = require(path.join('..', 'package.json'))
var Cite = require(path.join('..', cjs.main))

program
  .version(cjs.version)
  .usage('[options]')

  .option('-i, --input <path>',
          'Input file. If all input options are omitted, it uses stdin')
  .option('-t, --text <string>',
          'Input text. If all input options are omitted, it uses stdin')
  .option('-u, --url <string>',
          'Deprecated in favor of -t, --text. If all input options are omitted, it uses stdin')

  .option('-o, --output <path>',
          'Output file (omit file extension). If this option is omitted, the output is written to stdout')

  .option('-R, --output-non-real',
          'Output as a text file',
            false)
  .option('-f, --output-type <option>',
          'Output structure type: string, html, json',
          'json')
  .option('-s, --output-style <option>',
          'Ouput scheme. A combination of --output-format json and --output-style citation-* is considered invalid. ' +
          'Options: csl (Citation Style Lanugage JSON), bibtex, citation-* (where * is any formatting style)',
          'csl')
  .option('-l, --output-language <option>',
          'Output language. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes',
          'en-US')

  .parse(process.argv)

if (program.input && !fs.existsSync(program.input)) {
  throw new Error('Input file does not exist: ' + program.input)
}

var extension = program.outputStyle === 'bibtex' && program.outputType === 'string'
  ? 'bib'
  : program.outputNonReal
  ? 'txt'
  : {string: 'txt', html: 'html', json: 'json'}[program.outputType]

var saveOutput = function (data) {
  var output = data.get({
    format: 'string',
    type: program.outputType,
    style: program.outputStyle,
    lang: program.outputLanguage
  })

  if (!program.outputNonReal && program.outputType === 'html') {
    output = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + output + '</body></html>'
  }

  if (!program.output) {
    process.stdout.write(output)
  } else {
    fs.writeFile(program.output + extension, output, function (err) {
      if (err) {
        throw err
      }
    })
  }
}

var input

if (program.input || program.text || program.url) {
  input = program.input ? fs.readFileSync(program.input, 'utf8') : program.url || program.text
  Cite.async(input, saveOutput)
} else {
  input = ''

  process.stdin.setEncoding('utf8')
  process.stdin.on('readable', function () {
    var chunk = process.stdin.read()
    if (chunk !== null) {
      input += chunk
    }
  })
  process.stdin.on('end', function () {
    Cite.async(input, saveOutput)
  })
}
