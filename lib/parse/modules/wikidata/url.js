'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var scope = exports.scope = '@wikidata';
var types = exports.types = '@wikidata/url';
var parse = exports.parse = function parse(input) {
  return input.match(/\/(Q\d+)(?:[#?/]|\s*$)/)[1];
};