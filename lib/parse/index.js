'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csl = exports.input = exports.json = exports.name = exports.date = undefined;

var _csl = require('./csl');

Object.defineProperty(exports, 'csl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_csl).default;
  }
});

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

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

require('./modules/');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export {wikidata, bibtex, bibtxt, doi, bibjson, date, name, json, input}

// import * as wikidata from './modules/wikidata/index'
// import * as bibtex from './modules/bibtex/index'
// import * as bibtxt from './modules/bibtex/bibtxt'
// import * as doi from './modules/doi/index'
// import bibjson from './modules/bibjson/index'
exports.date = _date2.default;
exports.name = _name2.default;
exports.json = _json2.default;
exports.input = input;