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
  '@empty/text': function emptyText(input) {
    return input === '';
  },
  // Only whitespace
  '@empty/whitespace+text': /^\s+$/,
  // DOI API URL
  '@doi/api': _regex2.default.doi[0],
  // DOI ID
  '@doi/id': _regex2.default.doi[1],
  // DOI ID list
  '@doi/list+text': _regex2.default.doi[2],
  // Wikidata ID
  '@wikidata/id': _regex2.default.wikidata[0],
  // Wikidata entity list
  '@wikidata/list+text': _regex2.default.wikidata[1],
  // Wikidata API URL
  '@wikidata/api': _regex2.default.wikidata[2],
  // Wikidata URL
  '@wikidata/url': _regex2.default.wikidata[3],
  // BibTeX
  '@bibtex/text': _regex2.default.bibtex,
  // Bib.TXT
  '@bibtxt/text': _regex2.default.bibtxt,
  // JSON
  '@else/json': /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/,
  // Else URL
  '@else/url': _regex2.default.url
};

var types = {
  // Empty
  '@empty': function empty(input) {
    return input === null || input === undefined;
  },
  // jQuery
  '@else/jquery': function elseJquery(input) {
    return typeof jQuery !== 'undefined' && input instanceof jQuery;
  },
  // HTML
  '@else/html': function elseHtml(input) {
    return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
  }
};

var arrayTypes = {
  '@csl/list+object': function cslListObject(input) {
    return input.every(function (v) {
      return (0, _register.type)(v) === '@csl/object';
    });
  },
  '@wikidata/array': function wikidataArray(input) {
    return input.every(function (v) {
      return (0, _register.type)(v) === '@wikidata/id';
    });
  },
  '@doi/list+object': function doiListObject(input) {
    return input.every(function (v) {
      return (0, _register.type)(v) === '@doi/id';
    });
  },
  '@else/list+object': function elseListObject() {
    return true;
  }
};

var objectTypes = {
  '@wikidata/object': function wikidataObject(input) {
    return input.hasOwnProperty('entities');
  },
  '@contentmine/object': function contentmineObject(input) {
    return ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'].some(function (prop) {
      return input[prop] && Array.isArray(input[prop].value);
    });
  },
  '@bibtex/object': function bibtexObject(input) {
    return ['type', 'label', 'properties'].every(function (prop) {
      return input.hasOwnProperty(prop);
    });
  },
  '@csl/object': function cslObject(input) {
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