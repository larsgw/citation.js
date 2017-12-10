'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var parseDate = function parseDate(value) {
  var date = new Date(value);
  return date.getFullYear() ? { 'date-parts': [[date.getFullYear(), date.getMonth() + 1, date.getDate()]] } : { 'raw': value };
};

var scope = exports.scope = '@date';
var types = exports.types = '@date';
exports.parse = parseDate;
exports.default = parseDate;