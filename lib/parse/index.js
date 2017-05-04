'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.json = exports.name = exports.date = exports.bibjson = exports.wikidata = exports.input = undefined;

var _index = require('./input/index');

var input = _interopRequireWildcard(_index);

var _index2 = require('./wikidata/index');

var wikidata = _interopRequireWildcard(_index2);

var _index3 = require('./bibjson/index');

var _index4 = _interopRequireDefault(_index3);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.input = input;
exports.wikidata = wikidata;
exports.bibjson = _index4.default;
exports.date = _date2.default;
exports.name = _name2.default;
exports.json = _json2.default;