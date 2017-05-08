'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _name = require('../name');

var _name2 = _interopRequireDefault(_name);

var _date = require('../date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transform property and value from BibTeX-JSON format to CSL-JSON
 *
 * @access protected
 * @method parseBibTeXProp
 *
 * @param {String} prop - Property
 * @param {String|Number} value - Value
 *
 * @return {String[]} Array with new prop and value
 */
var parseBibTeXProp = function parseBibTeXProp(prop, value) {
  var rProp = prop;
  var rValue = value;

  switch (prop) {
    // Address
    case 'address':
      rProp = 'publisher-place';
      break;

    // Author
    case 'author':
      rValue = value.split(' and ').map(_name2.default);
      break;

    // Book title
    case 'booktitle':
      rProp = 'container-title';
      break;

    // DOI
    case 'doi':
      rProp = 'DOI';
      break;

    // Edition/print
    case 'edition':
      // rValue = parseOrdinal(value)
      break;

    // Editor
    case 'editor':
      rValue = value.split(' and ').map(_name2.default);
      break;

    // ISBN
    case 'isbn':
      rProp = 'ISBN';
      break;

    // ISSN
    case 'issn':
      rProp = 'ISSN';
      break;

    // Issue
    case 'issue':
    case 'number':
      rProp = 'issue';
      rValue = value.toString();
      break;

    // Journal
    case 'journal':
      rProp = 'container-title';
      break;

    // Location
    case 'location':
      rProp = 'publisher-place';
      break;

    // Pages
    case 'pages':
      rProp = 'page';
      rValue = value.replace(/[—–]/, '-');
      break;

    // Pubate
    case 'date':
      rProp = 'issued';
      rValue = (0, _date2.default)(value);
      break;

    case 'year':
      // Ignore for now
      // rProp = 'issued-year'
      break;

    case 'month':
      // Ignore for now
      // rProp = 'issued-month'
      break;

    // Publisher
    case 'publisher':
      // Nothing necessary, as far as I know
      break;

    // Series
    case 'series':
      rProp = 'collection-title';
      break;

    // Title
    case 'title':
      rProp = 'title';
      rValue = value.replace(/\.$/g, '');
      break;

    // URL
    case 'url':
      rProp = 'URL';
      break;

    // Volume
    case 'volume':
      rValue = value.toString();
      break;

    case 'crossref': // Crossref
    case 'keywords': // Keywords
    case 'language': // Language
    case 'note': // Note
    case 'pmid': // PMID
    case 'numpages':
      // Number of pages
      // Property ignored
      rProp = rValue = undefined;
      break;

    default:
      console.info('[set]', 'Unknown property: ' + prop);
      rProp = rValue = undefined;
      break;
  }

  if (rProp !== undefined && rValue !== undefined) {
    return [rProp, rValue];
  } else {
    return undefined;
  }
};

exports.default = parseBibTeXProp;