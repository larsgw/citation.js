"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.types = exports.scope = void 0;
var scope = '@wikidata';
exports.scope = scope;
var types = '@wikidata/url';
exports.types = types;

var parse = function parse(input) {
  return input.match(/\/(Q\d+)(?:[#?/]|\s*$)/)[1];
};

exports.parse = parse;