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

var _index = require('../bibjson/index');

var _index2 = _interopRequireDefault(_index);

var _text = require('../bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _json3 = require('../bibtex/json');

var _json4 = _interopRequireDefault(_json3);

var _json5 = require('../json');

var _json6 = _interopRequireDefault(_json5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Standardise input (internal use)
 * 
 * @access private
 * @method parseInputData
 * 
 * @param {String|String[]|Object|Object[]} input - The input data
 * @param {String} type - The input type
 * 
 * @return {CSL[]} The parsed input
 */
var parseInputData = function parseInputData(input, type) {
  var output;

  switch (type) {

    case 'string/wikidata':
      output = (0, _list2.default)(input.match(_regex2.default.wikidata[0])[1]);
      break;

    case 'list/wikidata':
      output = (0, _list2.default)(input.match(_regex2.default.wikidata[1])[1]);
      break;

    case 'api/wikidata':
      output = (0, _fetchFile2.default)(input);
      break;

    case 'url/wikidata':
      output = (0, _list2.default)(input.match(_regex2.default.wikidata[3])[1]);
      break;

    case 'array/wikidata':
      output = (0, _list2.default)(input.join(','));
      break;

    case 'url/else':
      output = (0, _fetchFile2.default)(input);
      break;

    case 'jquery/else':
      output = data.val() || data.text() || data.html();
      break;

    case 'html/else':
      output = data.value || data.textContent;
      break;

    case 'string/json':
      output = (0, _json6.default)(input);
      break;

    case 'string/bibtex':
      output = (0, _json4.default)((0, _text2.default)(input));
      break;

    case 'object/wikidata':
      output = (0, _json2.default)(input);
      break;

    case 'object/contentmine':
      output = (0, _index2.default)(input);
      break;

    case 'array/else':
      output = [];
      input.forEach(function (value) {
        output = output.concat((0, _chain2.default)(value));
      });
      break;

    case 'object/csl':
      output = [input];
      break;

    case 'array/csl':
      output = input;
      break;

    case 'string/empty':
    case 'string/whitespace':
    case 'empty':
    case 'invalid':
    default:
      output = [];
      break;

  }

  return output;
};

exports.default = parseInputData;