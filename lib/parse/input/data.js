'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseInputData;

var _register = require('../register');

var _fetchFile = require('../../util/fetchFile');

var _fetchFile2 = _interopRequireDefault(_fetchFile);

var _chain = require('./chain');

var _chain2 = _interopRequireDefault(_chain);

var _regex = require('../regex');

var _regex2 = _interopRequireDefault(_regex);

var _json = require('../json');

var _json2 = _interopRequireDefault(_json);

var _list = require('../modules/wikidata/list');

var _list2 = _interopRequireDefault(_list);

var _json3 = require('../modules/wikidata/json');

var _json4 = _interopRequireDefault(_json3);

var _id = require('../modules/doi/id');

var _id2 = _interopRequireDefault(_id);

var _api = require('../modules/doi/api');

var _api2 = _interopRequireDefault(_api);

var _index = require('../modules/bibjson/index');

var _index2 = _interopRequireDefault(_index);

var _text = require('../modules/bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _bibtxt = require('../modules/bibtex/bibtxt');

var _json5 = require('../modules/bibtex/json');

var _json6 = _interopRequireDefault(_json5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var parsers = {
  '@wikidata/id': _list2.default,
  '@wikidata/list+text': _list2.default,
  '@wikidata/api': _fetchFile2.default,
  '@wikidata/url': function wikidataUrl(input) {
    return input.match(_regex2.default.wikidata[3])[1];
  },
  '@wikidata/list+object': _list2.default,
  '@doi/api': _api2.default,
  '@doi/id': _id2.default,
  '@doi/list+text': _id2.default,
  '@doi/list+object': _id2.default,
  '@else/url': _fetchFile2.default,
  '@else/jquery': function elseJquery(input) {
    return input.val() || input.text() || input.html();
  },
  '@else/html': function elseHtml(input) {
    return input.value || input.textContent;
  },
  '@else/json': _json2.default,
  '@bibtex/text': _text2.default,
  '@bibtxt/text': _bibtxt.text,
  '@bibtex/object': _json6.default,
  '@wikidata/object': _json4.default,
  '@contentmine/object': _index2.default,
  '@else/list+object': function elseListObject(input) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(input.map(_chain2.default)));
  },
  '@csl/object': function cslObject(input) {
    return [input];
  },
  '@csl/list+object': function cslListObject(input) {
    return input;
  },
  '@empty/text': function emptyText() {
    return [];
  },
  '@empty/whitespace+text': function emptyWhitespaceText() {
    return [];
  },
  '@empty': function empty() {
    return [];
  },
  '@invalid': function invalid() {
    return [];
  }
};

for (var type in parsers) {
  (0, _register.add)(type, { parse: parsers[type] });
}

function parseInputData(data, type) {
  return parsers[type](data);
}