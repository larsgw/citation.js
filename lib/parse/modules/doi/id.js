'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var parseDoi = function parseDoi(data) {
  var list = Array.isArray(data) ? data : data.split(/(?:\s+)/g);
  return list.map(function (doi) {
    return 'https://doi.org/' + doi.trim();
  });
};

var scope = exports.scope = '@doi';
var types = exports.types = ['@doi/id', '@doi/list+text', '@doi/list+object'];
exports.parse = parseDoi;
exports.default = parseDoi;