'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * CSL pub type to BibTeX pub type
 *
 * @access protected
 * @method fetchBibTeXType
 *
 * @param {String} pubType - CSL type
 *
 * @return {String} BibTeX type
 */
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
      console.warn('CSL publication type not recognized: ' + pubType + '}. Interpreting as "misc".');
      return 'misc';
  }
};

exports.default = fetchBibTeXType;