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

  if (src.hasOwnProperty('author')) {
    props.author = src.author.map(_name2.default).join(' and ');
  }
  if (src.hasOwnProperty('event')) {
    props.organization = src.event;
  }
  if (src.hasOwnProperty('accessed')) {
    props.note = '[Online; accesed ' + (0, _date2.default)(src.accessed) + ']';
  }
  if (src.hasOwnProperty('DOI')) {
    props.doi = src.DOI;
  }
  if (src.hasOwnProperty('editor')) {
    props.editor = src.editor.map(_name2.default).join(' and ');
  }
  if (src.hasOwnProperty('ISBN')) {
    props.isbn = src.ISBN;
  }
  if (src.hasOwnProperty('ISSN')) {
    props.issn = src.ISSN;
  }
  if (src.hasOwnProperty('container-title')) {
    props.journal = src['container-title'];
  }
  if (src.hasOwnProperty('issue')) {
    props.issue = src.issue.toString();
  }
  if (src.hasOwnProperty('page')) {
    props.pages = src.page.replace('-', '--');
  }
  if (src.hasOwnProperty('publisher-place')) {
    props.address = src['publisher-place'];
  }
  if (src.hasOwnProperty('edition')) {
    props.edition = src.edition.toString();
  }
  if (src.hasOwnProperty('publisher')) {
    props.publisher = src.publisher;
  }
  if (src.hasOwnProperty('title')) {
    props.title = src['title'];
  }
  if (src.hasOwnProperty('url')) {
    props.url = src.url;
  }
  if (src.hasOwnProperty('volume')) {
    props.volume = src.volume.toString();
  }
  if (Array.isArray(src.issued) && src.issued[0]['date-parts'].length === 3) {
    props.year = src.issued[0]['date-parts'][0].toString();
  } else if (src.hasOwnProperty('year')) {
    props.year = src.year;
  }

  res.properties = props;

  return res;
};

exports.default = getBibTeXJSON;