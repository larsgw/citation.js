/* global jQuery, HTMLElement */

import varRegex from '../regex'

/**
 * Determine input type (internal use)
 *
 * @access protected
 * @method parseInputType
 *
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {String} The input type
 */
var parseInputType = function (input) {
  switch (typeof input) {
    case 'string':
      // Empty
      if (input.length === 0) {
        return 'string/empty'
      } else if (/^\s+$/.test(input)) {
        return 'string/whitespace'
      // Wikidata ID
      } else if (varRegex.wikidata[0].test(input)) {
        return 'string/wikidata'
      // Wikidata entity list
      } else if (varRegex.wikidata[1].test(input)) {
        return 'list/wikidata'
      // Wikidata API URL
      } else if (varRegex.wikidata[2].test(input)) {
        return 'api/wikidata'
      // Wikidata URL
      } else if (varRegex.wikidata[3].test(input)) {
        return 'url/wikidata'
      // BibTeX
      } else if (varRegex.bibtex[0].test(input)) {
        return 'string/bibtex'
      // Bib.TXT
      } else if (varRegex.bibtxt.test(input)) {
        return 'string/bibtxt'
      // JSON
      } else if (/^\s*(\{|\[)/.test(input)) {
        return 'string/json'
      // Else URL
      } else if (varRegex.url.test(input)) {
        return 'url/else'
      // Else
      } else {
        console.warn('[set]', 'This format is not supported or recognised')
        return 'invalid'
      }

    case 'object':
      // Empty
      if (input === null) {
        return 'empty'
      // jQuery
      } else if (typeof jQuery !== 'undefined' && input instanceof jQuery) {
        return 'jquery/else'
      // HTML
      } else if (typeof HTMLElement !== 'undefined' && input instanceof HTMLElement) {
        return 'html/else'
      // Array
      } else if (Array.isArray(input)) {
        // Empty array (counts as csl for parsing purposes)
        if (input.length === 0) {
          return 'array/csl'
        // Array of Wikidata IDs
        } else if (input.filter(v => parseInputType(v) === 'string/wikidata').length === input.length) {
          return 'array/wikidata'
        // Array of CSL-JSON
        } else if (input.filter(v => parseInputType(v) === 'object/csl').length === input.length) {
          return 'array/csl'
        // Array of misc or multiple types
        } else {
          return 'array/else'
        }
      // Object
      } else {
        // Wikidata
        if (input.hasOwnProperty('entities')) {
          return 'object/wikidata'
        // ContentMine
        } else if ((input.fulltext_html && Array.isArray(input.fulltext_html.value)) ||
                   (input.fulltext_xml && Array.isArray(input.fulltext_xml.value)) ||
                   (input.fulltext_pdf && Array.isArray(input.fulltext_pdf.value))) {
          return 'object/contentmine'
        // CSL-JSON
        } else {
          return 'object/csl'
        }
      }

    case 'undefined':
      // Empty
      return 'empty'

    default:
      console.warn('[set]', 'This format is not supported or recognised')
      return 'invalid'
  }
}

export default parseInputType
