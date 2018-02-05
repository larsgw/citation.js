"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var fetchBibTeXType = function fetchBibTeXType(pubType) {
  switch (pubType) {
    case 'article':
    case 'article-journal':
    case 'article-magazine':
    case 'article-newspaper':
      return 'article';

    case 'book':
      return 'book';

    case 'chapter':
      return 'incollection';

    case 'manuscript':
      return 'unpublished';

    case 'paper-conference':
      return 'inproceedings';

    case 'patent':
      return 'patent';

    case 'report':
      return 'techreport';

    case 'thesis':
      return 'phdthesis';

    case 'graphic':
    case 'interview':
    case 'motion_picture':
    case 'personal_communication':
    case 'webpage':
      return 'misc';

    default:
      logger.warn("CSL publication type not recognized: ".concat(pubType, "}. Interpreting as \"misc\"."));
      return 'misc';
  }
};

var _default = fetchBibTeXType;
exports.default = _default;