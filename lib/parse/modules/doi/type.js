"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;
var varDoiTypes = {
  'journal-article': 'article-journal',
  'book-chapter': 'chapter',
  'posted-content': 'manuscript',
  'proceedings-article': 'paper-conference'
};

var fetchDoiType = function fetchDoiType(value) {
  return varDoiTypes[value] || value;
};

exports.default = exports.parse = fetchDoiType;
var scope = '@doi';
exports.scope = scope;
var types = '@doi/type';
exports.types = types;