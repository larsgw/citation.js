'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

/**
 * Standardise input (internal use)
 *
 * @access protected
 * @method parseInputData
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {String} type - The input type
 *
 * @return {Array<CSL>} The parsed input
 */
var parseInputData = function parseInputData(input, type) {
  var _ref;

  switch (type) {
    case 'string/wikidata':
      return (0, _list2.default)(input.match(_regex2.default.wikidata[0])[1]);

    case 'list/wikidata':
      return (0, _list2.default)(input.match(_regex2.default.wikidata[1])[1]);

    case 'api/wikidata':
      return (0, _fetchFile2.default)(input);

    case 'url/wikidata':
      return (0, _list2.default)(input.match(_regex2.default.wikidata[3])[1]);

    case 'array/wikidata':
      return (0, _list2.default)(input.join(','));

    case 'api/doi':
      return (0, _api2.default)(input);

    case 'string/doi':
      return (0, _id2.default)(input);

    case 'list/doi':
      return (0, _id2.default)(input);

    case 'array/doi':
      return (0, _id2.default)(input.join('\n'));

    case 'url/else':
      return (0, _fetchFile2.default)(input);

    case 'jquery/else':
      return input.val() || input.text() || input.html();

    case 'html/else':
      return input.value || input.textContent;

    case 'string/json':
      return (0, _json6.default)(input);

    case 'string/bibtex':
      return (0, _text2.default)(input);

    case 'string/bibtxt':
      return (0, _bibtxt.text)(input);

    case 'object/bibtex':
      return (0, _json4.default)(input);

    case 'object/wikidata':
      return (0, _json2.default)(input);

    case 'object/contentmine':
      return (0, _index2.default)(input);

    case 'array/else':
      return (_ref = []).concat.apply(_ref, _toConsumableArray(input.map(function (value) {
        return (0, _chain2.default)(value);
      })));

    case 'object/csl':
      return [input];

    case 'array/csl':
      return input;

    case 'string/empty':
    case 'string/whitespace':
    case 'empty':
    case 'invalid':
    default:
      return [];
  }
};

exports.default = parseInputData;