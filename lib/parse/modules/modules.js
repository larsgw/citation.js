'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.other = exports.wikidata = exports.doi = exports.bibtex = exports.bibjson = undefined;

var _bibjson = require('./bibjson/');

var bibjson = _interopRequireWildcard(_bibjson);

var _bibtex = require('./bibtex/');

var bibtex = _interopRequireWildcard(_bibtex);

var _doi = require('./doi/');

var doi = _interopRequireWildcard(_doi);

var _wikidata = require('./wikidata/');

var wikidata = _interopRequireWildcard(_wikidata);

var _other = require('./other/');

var other = _interopRequireWildcard(_other);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.bibjson = bibjson;
exports.bibtex = bibtex;
exports.doi = doi;
exports.wikidata = wikidata;
exports.other = other;