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
    label: src.label || (0, _label2.default)(src),
    type: (0, _type2.default)(src.type)
  };

  var props = {};

  if (Array.isArray(src.author)) {
    props.author = src.author.map(_name2.default).join(' and ');
  }
  if (src.event) {
    props.organization = src.event;
  }
  if (Array.isArray(src.accessed)) {
    props.note = '[Online; accesed ' + (0, _date2.default)(src.accessed) + ']';
  }
  if (src.DOI) {
    props.doi = src.DOI;
  }
  if (Array.isArray(src.editor)) {
    props.editor = src.editor.map(_name2.default).join(' and ');
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
  if (typeof src.page === 'string') {
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
  if (Array.isArray(src.issued) && src.issued[0]['date-parts'].length === 3) {
    props.year = src.issued[0]['date-parts'][0].toString();
  } else if (src.year || src.year === 0) {
    props.year = src.year;
  }

  res.properties = props;

  return res;
};

exports.default = getBibTeXJSON;