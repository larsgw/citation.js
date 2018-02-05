"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.types = exports.scope = void 0;
var scope = '@else';
exports.scope = scope;
var types = '@else/html';
exports.types = types;

var parse = function parse(input) {
  return input.value || input.textContent;
};

exports.parse = parse;