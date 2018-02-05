"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  wikidata: true,
  bibtex: true,
  bibtxt: true,
  bibjson: true,
  doi: true,
  input: true,
  date: true,
  name: true,
  json: true,
  csl: true
};
Object.defineProperty(exports, "date", {
  enumerable: true,
  get: function get() {
    return _date.default;
  }
});
Object.defineProperty(exports, "name", {
  enumerable: true,
  get: function get() {
    return _name.default;
  }
});
Object.defineProperty(exports, "json", {
  enumerable: true,
  get: function get() {
    return _json.parse;
  }
});
Object.defineProperty(exports, "csl", {
  enumerable: true,
  get: function get() {
    return _csl.default;
  }
});
exports.input = exports.doi = exports.bibjson = exports.bibtxt = exports.bibtex = exports.wikidata = void 0;

var input = _interopRequireWildcard(require("./input/"));

exports.input = input;

var _date = _interopRequireDefault(require("./date"));

var _name = _interopRequireDefault(require("./name"));

require("./modules/");

var _bibjson = require("./modules/bibjson/");

var _bibtex = require("./modules/bibtex/");

var _doi = require("./modules/doi/");

var _wikidata = require("./modules/wikidata/");

var _json = require("./modules/other/json");

var _csl = _interopRequireDefault(require("./csl"));

var _registrar = require("./registrar/");

Object.keys(_registrar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _registrar[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var wikidata = {
  list: _wikidata.parsers.list.parse,
  json: _wikidata.parsers.json.parse,
  prop: _wikidata.parsers.prop.parse,
  type: _wikidata.parsers.type.parse,
  async: {
    json: _wikidata.parsers.json.parseAsync,
    prop: _wikidata.parsers.prop.parseAsync
  }
};
exports.wikidata = wikidata;
var bibtex = {
  json: _bibtex.parsers.json.parse,
  text: _bibtex.parsers.text.parse,
  prop: _bibtex.parsers.prop.parse,
  type: _bibtex.parsers.type.parse
};
exports.bibtex = bibtex;
var bibtxt = {
  text: _bibtex.parsers.bibtxt.text,
  textEntry: _bibtex.parsers.bibtxt.textEntry
};
exports.bibtxt = bibtxt;
var bibjson = _bibjson.parsers.json.parse;
exports.bibjson = bibjson;
var doi = {
  id: _doi.parsers.id.parse,
  api: _doi.parsers.api.parse,
  async: {
    api: _doi.parsers.api.parseAsync
  }
};
exports.doi = doi;