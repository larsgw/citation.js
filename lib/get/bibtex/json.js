'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _label = require('./label');

var _label2 = _interopRequireDefault(_label);

var _name = require('../name');

var _name2 = _interopRequireDefault(_name);

var _date = require('../date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get BibTeX-JSON from CSL(-JSON)
 *
 * @access protected
 * @method getBibTeXJSON
 *
 * @param {CSL} src - Input CSL
 *
 * @return {Object} Output BibTeX-JSON
 */
var getBibTeXJSON = function getBibTeXJSON(src) {
  var res = {
    label: (0, _label2.default)(src),
    type: (0, _type2.default)(src.type)
  };

  var props = {};

  var simple = {
    'collection-title': 'series',
    'container-title': src.type === 'chapter' ? 'booktitle' : 'journal',
    edition: 'edition',
    event: 'organization',
    DOI: 'doi',
    ISBN: 'isbn',
    ISSN: 'issn',
    issue: 'number',
    language: 'language',
    note: 'note',
    'number-of-pages': 'numpages',
    PMID: 'pmid',
    PMCID: 'pmcid',
    publisher: 'publisher',
    'publisher-place': 'address',
    title: 'title',
    url: 'url',
    volume: 'volume'
  };

  for (var prop in simple) {
    if (src.hasOwnProperty(prop)) {
      props[simple[prop]] = src[prop] + '';
    }
  }

  if (src.author) {
    props.author = src.author.map(function (name) {
      return (0, _name2.default)(name, true);
    }).join(' and ');
  }
  if (src.editor) {
    props.editor = src.editor.map(function (name) {
      return (0, _name2.default)(name, true);
    }).join(' and ');
  }

  if (!src.note && src.accessed) {
    props.note = '[Online; accessed ' + (0, _date2.default)(src.accessed) + ']';
  }

  if (src.page) {
    props.pages = src.page.replace('-', '--');
  }

  if (src.issued && src.issued['date-parts'][0].length === 3) {
    props.date = (0, _date2.default)(src.issued);
    props.year = src.issued['date-parts'][0][0].toString();
    props.month = src.issued['date-parts'][0][1].toString();
    props.day = src.issued['date-parts'][0][2].toString();
  }

  res.properties = props;

  return res;
};

exports.default = getBibTeXJSON;