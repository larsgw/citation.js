"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _name = _interopRequireDefault(require("./name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var NAME = 1;
var NAME_LIST = 2;
var DATE = 3;
var fieldTypes = {
  author: NAME_LIST,
  'collection-editor': NAME_LIST,
  composer: NAME_LIST,
  'container-author': NAME_LIST,
  editor: NAME_LIST,
  'editorial-director': NAME_LIST,
  director: NAME_LIST,
  interviewer: NAME_LIST,
  illustrator: NAME_LIST,
  'original-author': NAME_LIST,
  'reviewed-author': NAME_LIST,
  recipient: NAME_LIST,
  translator: NAME_LIST,
  accessed: DATE,
  container: DATE,
  'event-date': DATE,
  issued: DATE,
  'original-date': DATE,
  submitted: DATE,
  categories: 'object',
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
};

var correctName = function correctName(name) {
  var bestGuessConversions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (_typeof(name) === 'object' && (name.literal || name.given || name.family)) {
    return name;
  } else if (!bestGuessConversions) {
    return undefined;
  } else if (typeof name === 'string') {
    return (0, _name.default)(name);
  }
};

var correctNameList = function correctNameList(nameList) {
  var bestGuessConversions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (nameList instanceof Array) {
    return nameList.map(function (name) {
      return correctName(name, bestGuessConversions);
    }).filter(Boolean) || undefined;
  }
};

var correctDate = function correctDate(date) {
  var bestGuessConversions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var dp = 'date-parts';

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
    } else if (date[dp].some(function (part) {
      return part.some(function (datePart) {
        return typeof datePart === 'string';
      });
    })) {
      return _defineProperty({}, dp, date[dp].map(function (part) {
        return part.map(parseFloat);
      }));
    }
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

var correctField = function correctField(fieldName, value) {
  var bestGuessConversions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var fieldType = [].concat(fieldTypes[fieldName]);

  switch (fieldTypes[fieldName]) {
    case NAME:
      return correctName(value, bestGuessConversions);

    case NAME_LIST:
      return correctNameList(value, bestGuessConversions);

    case DATE:
      return correctDate(value, bestGuessConversions);
  }

  if (fieldType.includes(_typeof(value))) {
    return value;
  } else if (/^_/.test(value)) {
    return value;
  } else if (!bestGuessConversions) {
    return undefined;
  } else if (typeof value === 'string' && fieldType.includes('number') && parseFloat(value)) {
    return parseFloat(value);
  } else if (typeof value === 'number' && fieldType.includes('string') && !fieldType.includes('number')) {
    return value.toString();
  } else if (Array.isArray(value) && value.length) {
    return correctField(fieldName, value[0]);
  }
};

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

var _default = parseCsl;
exports.default = _default;