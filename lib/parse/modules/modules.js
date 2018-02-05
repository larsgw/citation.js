"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.other = exports.wikidata = exports.doi = exports.bibtex = exports.bibjson = void 0;

var bibjson = _interopRequireWildcard(require("./bibjson/"));

exports.bibjson = bibjson;

var bibtex = _interopRequireWildcard(require("./bibtex/"));

exports.bibtex = bibtex;

var doi = _interopRequireWildcard(require("./doi/"));

exports.doi = doi;

var wikidata = _interopRequireWildcard(require("./wikidata/"));

exports.wikidata = wikidata;

var other = _interopRequireWildcard(require("./other/"));

exports.other = other;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }