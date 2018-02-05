"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _type = _interopRequireDefault(require("./type"));

var _label = _interopRequireDefault(require("./label"));

var _name = _interopRequireDefault(require("../../name"));

var _date = _interopRequireDefault(require("../../date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getBibTeXJSON = function getBibTeXJSON(src) {
  var res = {
    label: (0, _label.default)(src),
    type: (0, _type.default)(src.type)
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
      return (0, _name.default)(name, true);
    }).join(' and ');
  }

  if (src.editor) {
    props.editor = src.editor.map(function (name) {
      return (0, _name.default)(name, true);
    }).join(' and ');
  }

  if (!src.note && src.accessed) {
    props.note = "[Online; accessed ".concat((0, _date.default)(src.accessed), "]");
  }

  if (src.page) {
    props.pages = src.page.replace('-', '--');
  }

  if (src.issued && src.issued['date-parts'][0].length === 3) {
    props.date = (0, _date.default)(src.issued);
    props.year = src.issued['date-parts'][0][0].toString();
    props.month = src.issued['date-parts'][0][1].toString();
    props.day = src.issued['date-parts'][0][2].toString();
  }

  res.properties = props;
  return res;
};

var _default = getBibTeXJSON;
exports.default = _default;