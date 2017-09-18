'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regex = require('../regex');

var _regex2 = _interopRequireDefault(_regex);

var _register = require('../register');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global jQuery, HTMLElement */

var stringTypes = {
  // Empty
  'string/empty': function stringEmpty(input) {
    return input === '';
  },
  // Only whitespace
  'string/whitespace': /^\s+$/,
  // DOI API URL
  'api/doi': _regex2.default.doi[0],
  // DOI ID
  'string/doi': _regex2.default.doi[1],
  // DOI ID list
  'list/doi': _regex2.default.doi[2],
  // Wikidata ID
  'string/wikidata': _regex2.default.wikidata[0],
  // Wikidata entity list
  'list/wikidata': _regex2.default.wikidata[1],
  // Wikidata API URL
  'api/wikidata': _regex2.default.wikidata[2],
  // Wikidata URL
  'url/wikidata': _regex2.default.wikidata[3],
  // BibTeX
  'string/bibtex': _regex2.default.bibtex,
  // Bib.TXT
  'string/bibtxt': _regex2.default.bibtxt,
  // JSON
  'string/json': /^\s*(\{|\[)/,
  // Else URL
  'url/else': _regex2.default.url
};

var types = {
  // Empty
  'empty': function empty(input) {
    return input === null || input === undefined;
  },
  // jQuery
  'jquery/else': function jqueryElse(input) {
    return typeof jQuery !== 'undefined' && input instanceof jQuery;
  },
  // HTML
  'html/else': function htmlElse(input) {
    return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
  }
};

var arrayTypes = {
  'array/csl': function arrayCsl(input) {
    return input.every(function (v) {
      return (0, _register.type)(v) === 'object/csl';
    });
  },
  'array/wikidata': function arrayWikidata(input) {
    return input.every(function (v) {
      return (0, _register.type)(v) === 'string/wikidata';
    });
  },
  'array/doi': function arrayDoi(input) {
    return input.every(function (v) {
      return (0, _register.type)(v) === 'string/doi';
    });
  },
  'array/else': function arrayElse() {
    return true;
  }
};

var objectTypes = {
  'object/wikidata': function objectWikidata(input) {
    return input.hasOwnProperty('entities');
  },
  'object/contentmine': function objectContentmine(input) {
    return ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'].some(function (prop) {
      return input[prop] && Array.isArray(input[prop].value);
    });
  },
  'object/bibtex': function objectBibtex(input) {
    return ['type', 'label', 'properties'].every(function (prop) {
      return input.hasOwnProperty(prop);
    });
  },
  'object/csl': function objectCsl(input) {
    return true;
  }
};

for (var _type in stringTypes) {
  (0, _register.add)(_type, { parseType: stringTypes[_type] });
}
for (var _type2 in types) {
  (0, _register.add)(_type2, { parseType: types[_type2] });
}

var _loop = function _loop(_type3) {
  (0, _register.add)(_type3, { parseType: function parseType(input) {
      return Array.isArray(input) && arrayTypes[_type3](input);
    } });
};

for (var _type3 in arrayTypes) {
  _loop(_type3);
}
for (var _type4 in objectTypes) {
  (0, _register.add)(_type4, { parseType: objectTypes[_type4] });
}

exports.default = _register.type;