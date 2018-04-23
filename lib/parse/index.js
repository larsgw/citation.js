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
  json: true,
  date: true,
  name: true,
  csl: true
};
Object.defineProperty(exports, "json", {
  enumerable: true,
  get: function get() {
    return _json.parse;
  }
});
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
Object.defineProperty(exports, "csl", {
  enumerable: true,
  get: function get() {
    return _csl.default;
  }
});
exports.input = exports.doi = exports.bibjson = exports.bibtxt = exports.bibtex = exports.wikidata = void 0;

require("./modules/");

var _chain = require("./interface/chain");

var _data = require("./interface/data");

var _type = require("./interface/type");

var _bibjson = require("./modules/bibjson/");

var _bibtex = require("./modules/bibtex/");

var _doi = require("./modules/doi/");

var _wikidata = require("./modules/wikidata/");

var _json = require("./modules/other/json");

var _date = _interopRequireDefault(require("./date"));

var _name = _interopRequireDefault(require("./name"));

var _csl = _interopRequireDefault(require("./csl"));

var _interface = require("./interface/");

Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _interface[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var input = {
  chain: _chain.chain,
  chainAsync: _chain.chainAsync,
  chainLink: _chain.chainLink,
  chainLinkAsync: _chain.chainLinkAsync,
  data: _data.data,
  dataAsync: _data.dataAsync,
  type: _type.type,
  async: {
    chain: _chain.chainAsync,
    chainLink: _chain.chainLinkAsync,
    data: _data.dataAsync
  }
};
exports.input = input;