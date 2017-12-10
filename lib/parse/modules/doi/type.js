'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var varDoiTypes = {
  'journal-article': 'article-journal',
  'book-chapter': 'chapter',
  'posted-content': 'manuscript',
  'proceedings-article': 'paper-conference'
};

var fetchDoiType = function fetchDoiType(value) {
  return varDoiTypes[value] || value;
};

var scope = exports.scope = '@doi';
var types = exports.types = '@doi/type';
exports.parse = fetchDoiType;
exports.default = fetchDoiType;