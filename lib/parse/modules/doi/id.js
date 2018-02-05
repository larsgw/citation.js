"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;

var parseDoi = function parseDoi(data) {
  var list = Array.isArray(data) ? data : data.trim().split(/(?:\s+)/g);
  return list.map(function (doi) {
    return "https://doi.org/".concat(doi);
  });
};

exports.default = exports.parse = parseDoi;
var scope = '@doi';
exports.scope = scope;
var types = ['@doi/id', '@doi/list+text', '@doi/list+object'];
exports.types = types;