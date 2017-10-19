'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csl = exports.input = exports.name = exports.date = exports.json = exports.doi = exports.bibjson = exports.bibtxt = exports.bibtex = exports.wikidata = undefined;

var _json = require('./modules/other/json');

Object.defineProperty(exports, 'json', {
  enumerable: true,
  get: function get() {
    return _json.parse;
  }
});

var _csl = require('./csl');

Object.defineProperty(exports, 'csl', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_csl).default;
  }
});

var _registrar = require('./registrar/');

Object.keys(_registrar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _registrar[key];
    }
  });
});

var _input = require('./input/');

var input = _interopRequireWildcard(_input);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

require('./modules/');

var _bibjson = require('./modules/bibjson/');

var _bibtex = require('./modules/bibtex/');

var _doi = require('./modules/doi/');

var _wikidata = require('./modules/wikidata/');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// BEGIN compat
var wikidata = exports.wikidata = {
  list: _wikidata.parsers.list.parse,
  json: _wikidata.parsers.json.parse,
  prop: _wikidata.parsers.prop.parse,
  type: _wikidata.parsers.type.parse,
  async: { json: _wikidata.parsers.json.parseAsync, prop: _wikidata.parsers.prop.parseAsync }
};
var bibtex = exports.bibtex = {
  json: _bibtex.parsers.json.parse,
  text: _bibtex.parsers.text.parse,
  prop: _bibtex.parsers.prop.parse,
  type: _bibtex.parsers.type.parse
};
var bibtxt = exports.bibtxt = {
  text: _bibtex.parsers.bibtxt.text,
  textEntry: _bibtex.parsers.bibtxt.textEntry
};
var bibjson = exports.bibjson = _bibjson.parsers.json.parse;
var doi = exports.doi = {
  id: _doi.parsers.id.parse,
  api: _doi.parsers.api.parse,
  async: { api: _doi.parsers.api.parseAsync }
};

// END compat

exports.date = _date2.default;
exports.name = _name2.default;
exports.input = input;