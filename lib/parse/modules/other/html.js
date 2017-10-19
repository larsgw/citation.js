'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var scope = exports.scope = '@else';
var types = exports.types = '@else/html';
var parse = exports.parse = function parse(input) {
  return input.value || input.textContent;
};