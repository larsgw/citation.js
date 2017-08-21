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
 * Parse date into list of CSL date object.
 *
 * @access private
 * @method parseBibtexDate
 *
 * @param {String} value - date
 * @return {Object} CSL date object
 */
var parseBibtexDate = function parseBibtexDate(value) {
  if (/{|}/.test(value)) {
    return { literal: value.replace(/[{}]/g, '') };
  } else {
    return (0, _date2.default)(value);
  }
};

/**
 * Parse name into CSL name objects.
 *
 * @access private
 * @method parseBibtexName
 *
 * @param {String} name - name
 * @return {Object} CSL name object
 */
var parseBibtexName = function parseBibtexName(name) {
  if (/{|}/.test(name)) {
    return { literal: name.replace(/[{}]/g, '') };
  } else {
    return (0, _name2.default)(name);
  }
};

/**
 * Parse list of names into list of CSL name objects.
 *
 * @access private
 * @method parseBibtexNameList
 *
 * @param {String} list - list of names separated by ' and '
 * @return {Array<Object>} array of CSL name objects
 */
var parseBibtexNameList = function parseBibtexNameList(list) {
  var literals = [];

  // To split author names by ' and '  while supporting literal names like
  // '{National Academy for Arts and Sciences}' (i.e. some name with ' and '
  // in it), we first pick a escaping character ('%')...

  // ...escape all '%'s and remove all literals ('{...}')...
  list = list.replace(/%/g, '%0').replace(/{.*?}/g, function (m) {
    return '%[' + (literals.push(m) - 1) + ']';
  });

  // ...split the string...
  return list.split(' and ')
  // ...re-insert all literals and unescape all '%'s...
  .map(function (name) {
    return name.replace(/%\[(\d+)\]/, function (_, i) {
      return literals[+i];
    }).replace(/%0/g, '%');
  })
  // ...and parse the names to make sure literals are actually preserved.
  .map(parseBibtexName);
};

/**
 * Map holding information on BibTeX-JSON fields.
 *
 *  * If true, field name should stay the same
 *  * If false, field should be ignored
 *  * If string, use as field name
 *  * Special strings are used to merge into complex objects
 *
 * @access private
 * @constant propMap
 * @default
 */
var propMap = {
  address: 'publisher-place',
  author: true,
  booktitle: 'container-title',
  doi: 'DOI',
  date: 'issued',
  edition: true,
  editor: true,
  isbn: 'ISBN',
  issn: 'ISSN',
  issue: 'issue',
  journal: 'container-title',
  location: 'publisher-place',
  number: 'issue',
  pages: 'page',
  publisher: true,
  series: 'collection-title',
  title: true,
  url: 'URL',
  volume: true,

  // prepare for merge
  year: 'issued:date-parts.0.0',
  month: 'issued:date-parts.0.1',

  // ignore
  crossref: false,
  keywords: false,
  language: false,
  note: false,
  numpages: false,
  pmid: false

  /**
   * Transform property and value from BibTeX-JSON format to CSL-JSON
   *
   * @access protected
   * @method parseBibTeXProp
   *
   * @param {String} name - Field name
   * @param {String} value - Field value
   *
   * @return {Array<String>} Array with new name and value
   */
};var parseBibTeXProp = function parseBibTeXProp(name, value) {
  if (!propMap.hasOwnProperty(name)) {
    console.info('[set]', 'Unknown property: ' + name);
    return undefined;
  } else if (propMap[name] === false) {
    return undefined;
  }

  var cslProp = propMap[name] === true ? name : propMap[name];
  var cslValue = function (name, value) {
    switch (name) {
      case 'author':
      case 'editor':
        return parseBibtexNameList(value);

      case 'issued':
        return parseBibtexDate(value);

      case 'edition':
        // return parseOrdinal(value)
        return value;

      case 'page':
        return value.replace(/[—–]/, '-');

      default:
        return value.replace(/[{}]/g, '');
    }
  }(cslProp, value);

  return [cslProp, cslValue];
};

exports.default = parseBibTeXProp;