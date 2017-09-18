'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseInputData;

var _register = require('../register');

var _regex = require('../regex');

var _regex2 = _interopRequireDefault(_regex);

var _fetchFile = require('../../util/fetchFile');

var _fetchFile2 = _interopRequireDefault(_fetchFile);

var _chain = require('./chain');

var _chain2 = _interopRequireDefault(_chain);

var _list = require('../wikidata/list');

var _list2 = _interopRequireDefault(_list);

var _json = require('../wikidata/json');

var _json2 = _interopRequireDefault(_json);

var _id = require('../doi/id');

var _id2 = _interopRequireDefault(_id);

var _api = require('../doi/api');

var _api2 = _interopRequireDefault(_api);

var _index = require('../bibjson/index');

var _index2 = _interopRequireDefault(_index);

var _text = require('../bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _bibtxt = require('../bibtxt');

var _json3 = require('../bibtex/json');

var _json4 = _interopRequireDefault(_json3);

var _json5 = require('../json');

var _json6 = _interopRequireDefault(_json5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var parsers = {
  '@wikidata/id': function wikidataId(input) {
    return (0, _list2.default)(input.match(_regex2.default.wikidata[0])[1]);
  },
  '@wikidata/list+text': function wikidataListText(input) {
    return (0, _list2.default)(input.match(_regex2.default.wikidata[1])[1]);
  },
  '@wikidata/api': function wikidataApi(input) {
    return (0, _fetchFile2.default)(input);
  },
  '@wikidata/url': function wikidataUrl(input) {
    return (0, _list2.default)(input.match(_regex2.default.wikidata[3])[1]);
  },
  '@wikidata/list+object': function wikidataListObject(input) {
    return (0, _list2.default)(input.join(','));
  },
  '@doi/api': function doiApi(input) {
    return (0, _api2.default)(input);
  },
  '@doi/id': function doiId(input) {
    return (0, _id2.default)(input);
  },
  '@doi/list+text': function doiListText(input) {
    return (0, _id2.default)(input);
  },
  '@doi/list+object': function doiListObject(input) {
    return (0, _id2.default)(input.join('\n'));
  },
  '@else/url': function elseUrl(input) {
    return (0, _fetchFile2.default)(input);
  },
  '@else/jquery': function elseJquery(input) {
    return input.val() || input.text() || input.html();
  },
  '@else/html': function elseHtml(input) {
    return input.value || input.textContent;
  },
  '@else/json': function elseJson(input) {
    return (0, _json6.default)(input);
  },
  '@bibtex/text': function bibtexText(input) {
    return (0, _text2.default)(input);
  },
  '@bibtxt/text': function bibtxtText(input) {
    return (0, _bibtxt.text)(input);
  },
  '@bibtex/object': function bibtexObject(input) {
    return (0, _json4.default)(input);
  },
  '@wikidata/object': function wikidataObject(input) {
    return (0, _json2.default)(input);
  },
  '@contentmine/object': function contentmineObject(input) {
    return (0, _index2.default)(input);
  },
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