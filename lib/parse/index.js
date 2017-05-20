'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.json = exports.name = exports.date = exports.bibjson = exports.bibtxt = exports.bibtex = exports.wikidata = exports.input = undefined;

var _index = require('./input/index');

var input = _interopRequireWildcard(_index);

var _index2 = require('./wikidata/index');

var wikidata = _interopRequireWildcard(_index2);

var _index3 = require('./bibtex/index');

var bibtex = _interopRequireWildcard(_index3);

var _bibtxt = require('./bibtxt');

var bibtxt = _interopRequireWildcard(_bibtxt);

var _index4 = require('./bibjson/index');

var _index5 = _interopRequireDefault(_index4);

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
exports.bibtex = bibtex;
exports.bibtxt = bibtxt;
exports.bibjson = _index5.default;
exports.date = _date2.default;
exports.name = _name2.default;
exports.json = _json2.default;