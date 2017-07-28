'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Object containing types for CSL-JSON fields.
 * Data from https://github.com/citation-style-language/schema/blob/master/csl-data.json
 *
 * @access private
 * @constant fieldTypes
 * @default
 */
var fieldTypes = {
  categories: 'object', // TODO Array<String>

  id: ['string', 'number'],
  type: 'string',
  language: 'string',
  journalAbbreviation: 'string',
  shortTitle: 'string',
  abstract: 'string',
  annote: 'string',
  archive: 'string',
  archive_location: 'string',
  'archive-place': 'string',
  authority: 'string',
  'call-number': 'string',
  'chapter-number': 'string',
  'citation-number': 'string',
  'citation-label': 'string',
  'collection-number': 'string',
  'collection-title': 'string',
  'container-title': 'string',
  'container-title-short': 'string',
  dimensions: 'string',
  DOI: 'string',
  edition: ['string', 'number'],
  event: 'string',
  'event-place': 'string',
  'first-reference-note-number': 'string',
  genre: 'string',
  ISBN: 'string',
  ISSN: 'string',
  issue: ['string', 'number'],
  jurisdiction: 'string',
  keyword: 'string',
  locator: 'string',
  medium: 'string',
  note: 'string',
  number: ['string', 'number'],
  'number-of-pages': 'string',
  'number-of-volumes': ['string', 'number'],
  'original-publisher': 'string',
  'original-publisher-place': 'string',
  'original-title': 'string',
  page: 'string',
  'page-first': 'string',
  PMCID: 'string',
  PMID: 'string',
  publisher: 'string',
  'publisher-place': 'string',
  references: 'string',
  'reviewed-title': 'string',
  scale: 'string',
  section: 'string',
  source: 'string',
  status: 'string',
  title: 'string',
  'title-short': 'string',
  URL: 'string',
  version: 'string',
  volume: ['string', 'number'],
  'year-suffix': 'string'

  /**
   * Correct a name.
   *
   * @access private
   * @method correctName
   *
   * @param {*} name - name
   * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
   *
   * @return {Object} returns the (corrected) value if possible, otherwise undefined
   */
};var correctName = function correctName(name) {
  var bestGuessConversions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' && (name.literal || name.given || name.family)) {
    return name;
  } else if (!bestGuessConversions) {
    return undefined;
  } else if (typeof name === 'string') {
    return (0, _name2.default)(name);
  }
};

/**
 * Correct a name field.
 *
 * @access private
 * @method correctNameList
 *
 * @param {*} nameList - name list
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {Array<Object>|undefined} returns the (corrected) value if possible, otherwise undefined
 */
var correctNameList = function correctNameList(nameList) {
  var bestGuessConversions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (nameList instanceof Array) {
    return nameList.map(function (name) {
      return correctName(name, bestGuessConversions);
    }).filter(Boolean) || undefined;
  }
};

/**
 * Correct a date field.
 *
 * @access private
 * @method correctDate
 *
 * @param {*} date - date
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {Array<Object>|undefined} returns the (corrected) value if possible, otherwise undefined
 */
var correctDate = function correctDate(date) {
  var bestGuessConversions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var dp = 'date-parts';

  // "{'date-parts': [[2000, 1, 1], ...]}"
  if (date && date[dp] instanceof Array && date[dp].every(function (part) {
    return part instanceof Array;
  })) {
    if (date[dp].every(function (part) {
      return part.every(function (datePart) {
        return typeof datePart === 'number';
      });
    })) {
      return _defineProperty({}, dp, date[dp].map(function (part) {
        return part.slice();
      }));
    } else if (!bestGuessConversions) {
      return undefined;
    } else if (date[dp].every(function (part) {
      return part.every(function (datePart) {
        return typeof datePart === 'string';
      });
    })) {
      return _defineProperty({}, dp, date[dp].map(function (part) {
        return part.map(parseFloat);
      }));
    }

    // LEGACY support
    // "[{'date-parts': [2000, 1, 1]}, ...]"
  } else if (date && date instanceof Array && date[0][dp] instanceof Array) {
    if (date[0][dp].every(function (datePart) {
      return typeof datePart === 'number';
    })) {
      return _defineProperty({}, dp, [date[0][dp].slice()]);
    } else if (!bestGuessConversions) {
      return undefined;
    } else if (date[0][dp].every(function (datePart) {
      return typeof datePart === 'string';
    })) {
      return _defineProperty({}, dp, [date[0][dp].map(parseFloat)]);
    }
  }
};

/**
 * Correct a field.
 *
 * @access private
 * @method correctField
 *
 * @param {String} fieldName - field name
 * @param {*} value - value
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {*|undefined} returns the (corrected) value if possible, otherwise undefined
 */
var correctField = function correctField(fieldName, value) {
  var bestGuessConversions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  switch (fieldName) {
    case 'author':
    case 'editor':
    case 'interviewer':
    case 'illustrator':
    case 'translator':
    case 'original-author':
    case 'reviewed-author':
    case 'recipient':
    case 'editorial-director':
    case 'director':
    case 'container-author':
    case 'composer':
    case 'collection-editor':
      return correctNameList(value, bestGuessConversions);

    case 'submitted':
    case 'issued':
    case 'event-date':
    case 'original-date':
    case 'container':
    case 'accessed':
      return correctDate(value, bestGuessConversions);
  }

  var fieldType = [].concat(fieldTypes[fieldName]);

  if (fieldType.includes(typeof value === 'undefined' ? 'undefined' : _typeof(value))) {
    return value;
  } else if (!bestGuessConversions) {
    return undefined;
  } else if (typeof value === 'string' && fieldType.includes('number')) {
    return parseFloat(value);
  } else if (typeof value === 'number' && fieldType.includes('string')) {
    return value.toString();
  } else if (Array.isArray(value) && value.length) {
    return correctField(fieldName, value[0]);
  }
};

/**
 * Make CSL JSON conform to standards. This, unfortunately, needs to happen, so it doesn't have to happen anywhere else.
 *
 * @access protected
 * @method parseCsl
 *
 * @param {CSL[]} data - Array of CSL
 *
 * @return {CSL[]} Array of clean CSL
 */
var parseCsl = function parseCsl(data) {
  return data.map(function (entry) {
    var clean = {};

    for (var field in entry) {
      var correction = correctField(field, entry[field]);
      if (correction !== undefined) {
        clean[field] = correction;
      }
    }

    return clean;
  });
};

exports.default = parseCsl;