"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;

var parseDate = function parseDate(value) {
  var date = new Date(value);
  return date.getFullYear() ? {
    'date-parts': [[date.getFullYear(), date.getMonth() + 1, date.getDate()]]
  } : {
    'raw': value
  };
};

exports.default = exports.parse = parseDate;
var scope = '@date';
exports.scope = scope;
var types = '@date';
exports.types = types;