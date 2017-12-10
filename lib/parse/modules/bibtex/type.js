'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    logger.warn('[set]', 'BibTeX publication type not recognized: ' + pubType + '. Defaulting to "book".');
    return 'book';
  } else if (typeMap[pubType] === false) {
    return 'book';
  } else {
    return typeMap[pubType];
  }
};

var scope = exports.scope = '@bibtex';
var types = exports.types = '@bibtex/type';
exports.parse = parseBibTeXType;
exports.default = parseBibTeXType;