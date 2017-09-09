'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csl = exports.json = exports.name = exports.date = exports.bibjson = exports.doi = exports.bibtxt = exports.bibtex = exports.wikidata = exports.input = undefined;

var _register = require('./register');

Object.keys(_register).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _register[key];
    }
  });
});

var _index = require('./input/index');

var input = _interopRequireWildcard(_index);

var _index2 = require('./wikidata/index');

var wikidata = _interopRequireWildcard(_index2);

var _index3 = require('./bibtex/index');

var bibtex = _interopRequireWildcard(_index3);

var _bibtxt = require('./bibtxt');

var bibtxt = _interopRequireWildcard(_bibtxt);

var _index4 = require('./doi/index');

var doi = _interopRequireWildcard(_index4);

var _index5 = require('./bibjson/index');

var _index6 = _interopRequireDefault(_index5);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

var _csl = require('./csl');

var _csl2 = _interopRequireDefault(_csl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.input = input;
exports.wikidata = wikidata;
exports.bibtex = bibtex;
exports.bibtxt = bibtxt;
exports.doi = doi;
exports.bibjson = _index6.default;
exports.date = _date2.default;
exports.name = _name2.default;
exports.json = _json2.default;
exports.csl = _csl2.default;