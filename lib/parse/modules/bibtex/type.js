"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;
var typeMap = {
  article: 'article-journal',
  book: 'book',
  booklet: 'book',
  proceedings: 'book',
  manual: false,
  mastersthesis: 'thesis',
  misc: false,
  inbook: 'chapter',
  incollection: 'chapter',
  conference: 'paper-conference',
  inproceedings: 'paper-conference',
  online: 'website',
  patent: 'patent',
  phdthesis: 'thesis',
  techreport: 'report',
  unpublished: 'manuscript'
};

var parseBibTeXType = function parseBibTeXType(pubType) {
  if (!typeMap.hasOwnProperty(pubType)) {
    logger.warn('[set]', "BibTeX publication type not recognized: ".concat(pubType, ". Defaulting to \"book\"."));
    return 'book';
  } else if (typeMap[pubType] === false) {
    return 'book';
  } else {
    return typeMap[pubType];
  }
};

exports.default = exports.parse = parseBibTeXType;
var scope = '@bibtex';
exports.scope = scope;
var types = '@bibtex/type';
exports.types = types;