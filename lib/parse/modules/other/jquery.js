"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.types = exports.scope = void 0;
var scope = '@else';
exports.scope = scope;
var types = '@else/jquery';
exports.types = types;

var parse = function parse(input) {
  return input.val() || input.text() || input.html();
};

exports.parse = parse;