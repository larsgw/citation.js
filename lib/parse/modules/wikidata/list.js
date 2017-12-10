'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = undefined;

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseWikidata = function parseWikidata(data) {
  var list = Array.isArray(data) ? data : data.trim().split(/(?:\s+|,\s*)/g);
  return [].concat(_wikidataSdk2.default.getEntities(list, ['en']));
};

var scope = exports.scope = '@wikidata';
var types = exports.types = ['@wikidata/list+text', '@wikidata/id', '@wikidata/list+object'];
exports.parse = parseWikidata;
exports.default = parseWikidata;