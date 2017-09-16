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
  'string/wikidata': function stringWikidata(input) {
    return (0, _list2.default)(input.match(_regex2.default.wikidata[0])[1]);
  },
  'list/wikidata': function listWikidata(input) {
    return (0, _list2.default)(input.match(_regex2.default.wikidata[1])[1]);
  },
  'api/wikidata': function apiWikidata(input) {
    return (0, _fetchFile2.default)(input);
  },
  'url/wikidata': function urlWikidata(input) {
    return (0, _list2.default)(input.match(_regex2.default.wikidata[3])[1]);
  },
  'array/wikidata': function arrayWikidata(input) {
    return (0, _list2.default)(input.join(','));
  },
  'api/doi': function apiDoi(input) {
    return (0, _api2.default)(input);
  },
  'string/doi': function stringDoi(input) {
    return (0, _id2.default)(input);
  },
  'list/doi': function listDoi(input) {
    return (0, _id2.default)(input);
  },
  'array/doi': function arrayDoi(input) {
    return (0, _id2.default)(input.join('\n'));
  },
  'url/else': function urlElse(input) {
    return (0, _fetchFile2.default)(input);
  },
  'jquery/else': function jqueryElse(input) {
    return input.val() || input.text() || input.html();
  },
  'html/else': function htmlElse(input) {
    return input.value || input.textContent;
  },
  'string/json': function stringJson(input) {
    return (0, _json6.default)(input);
  },
  'string/bibtex': function stringBibtex(input) {
    return (0, _text2.default)(input);
  },
  'string/bibtxt': function stringBibtxt(input) {
    return (0, _bibtxt.text)(input);
  },
  'object/bibtex': function objectBibtex(input) {
    return (0, _json4.default)(input);
  },
  'object/wikidata': function objectWikidata(input) {
    return (0, _json2.default)(input);
  },
  'object/contentmine': function objectContentmine(input) {
    return (0, _index2.default)(input);
  },
  'array/else': function arrayElse(input) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(input.map(_chain2.default)));
  },
  'object/csl': function objectCsl(input) {
    return [input];
  },
  'array/csl': function arrayCsl(input) {
    return input;
  },
  'string/empty': function stringEmpty() {
    return [];
  },
  'string/whitespace': function stringWhitespace() {
    return [];
  },
  'empty': function empty() {
    return [];
  },
  'invalid': function invalid() {
    return [];
  }
};

for (var type in parsers) {
  (0, _register.add)(type, { data: parsers[type] });
}

function parseInputData(data, type) {
  return parsers[type](data);
}