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

  if (src.author) {
    props.author = src.author.map(function (name) {
      return (0, _name2.default)(name, true);
    }).join(' and ');
  }
  if (src.event) {
    props.organization = src.event;
  }
  if (src.accessed) {
    props.note = '[Online; accesed ' + (0, _date2.default)(src.accessed) + ']';
  }
  if (src.DOI) {
    props.doi = src.DOI;
  }
  if (src.editor) {
    props.editor = src.editor.map(function (name) {
      return (0, _name2.default)(name, true);
    }).join(' and ');
  }
  if (src.ISBN) {
    props.isbn = src.ISBN;
  }
  if (src.ISSN) {
    props.issn = src.ISSN;
  }
  if (src['container-title']) {
    props.journal = src['container-title'];
  }
  if (src.issue || src.issue === 0) {
    props.issue = src.issue.toString();
  }
  if (src.page) {
    props.pages = src.page.replace('-', '--');
  }
  if (src['publisher-place']) {
    props.address = src['publisher-place'];
  }
  if (src.edition || src.edition === 0) {
    props.edition = src.edition.toString();
  }
  if (src.publisher) {
    props.publisher = src.publisher;
  }
  if (src.title) {
    props.title = src['title'];
  }
  if (src.url) {
    props.url = src.url;
  }
  if (src.volume || src.volume === 0) {
    props.volume = src.volume.toString();
  }
  if (src.issued && src.issued['date-parts'][0].length === 3) {
    props.year = src.issued['date-parts'][0][0].toString();
  }

  res.properties = props;

  return res;
};

exports.default = getBibTeXJSON;