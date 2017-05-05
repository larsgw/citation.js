'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* global jQuery, HTMLElement */

var _regex = require('../regex');

var _regex2 = _interopRequireDefault(_regex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determine input type (internal use)
 *
 * @access private
 * @method parseInputType
 *
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {String} The input type
 */
var parseInputType = function parseInputType(input) {
  switch (typeof input === 'undefined' ? 'undefined' : _typeof(input)) {
    case 'string':
      // Empty
      if (input.length === 0) {
        return 'string/empty';
      } else if (/^\s+$/.test(input)) {
        return 'string/whitespace';
        // Wikidata ID
      } else if (_regex2.default.wikidata[0].test(input)) {
        return 'string/wikidata';
        // Wikidata entity list
      } else if (_regex2.default.wikidata[1].test(input)) {
        return 'list/wikidata';
        // Wikidata API URL
      } else if (_regex2.default.wikidata[2].test(input)) {
        return 'api/wikidata';
        // Wikidata URL
      } else if (_regex2.default.wikidata[3].test(input)) {
        return 'url/wikidata';
        // BibTeX
      } else if (_regex2.default.bibtex[0].test(input)) {
        return 'string/bibtex';
        // JSON
      } else if (/^\s*(\{|\[)/.test(input)) {
        return 'string/json';
        // Else URL
      } else if (_regex2.default.url.test(input)) {
        return 'url/} else';
        // Else
      } else {
        return console.warn('[set]', 'This format is not supported or recognised') || 'invalid';
      }

    case 'object':
      // Empty
      if (input === null) {
        return 'empty';
        // jQuery
      } else if (typeof jQuery !== 'undefined' && input instanceof jQuery) {
        return 'jquery/else';
        // HTML
      } else if (typeof HTMLElement !== 'undefined' && input instanceof HTMLElement) {
        return 'html/else';
        // Array
      } else if (Array.isArray(input)) {
        // Empty array (counts as csl for parsing purposes)
        if (input.length === 0) {
          return 'array/csl';
          // Array of Wikidata IDs
        } else if (input.filter(function (v) {
          return parseInputType(v) === 'string/wikidata';
        }).length === input.length) {
          return 'array/wikidata';
          // Array of CSL-JSON
        } else if (input.filter(function (v) {
          return parseInputType(v) === 'object/csl';
        }).length === input.length) {
          return 'array/csl';
          // Array of misc or multiple types
        } else {
          return 'array/else';
        }
        // Object
      } else {
        // Wikidata
        if (input.hasOwnProperty('entities')) {
          return 'object/wikidata';
          // ContentMine
        } else if (input.fulltext_html && Array.isArray(input.fulltext_html.value) || input.fulltext_xml && Array.isArray(input.fulltext_xml.value) || input.fulltext_pdf && Array.isArray(input.fulltext_pdf.value)) {
          return 'object/contentmine';
          // CSL-JSON
        } else {
          return 'object/csl';
        }
      }

    case 'undefined':
      // Empty
      return 'empty';

    default:
      console.warn('[set]', 'This format is not supported or recognised');
      return 'invalid';
  }
};

exports.default = parseInputType;