/**
 * BibTeX pub type to CSL pub type
 *
 * @access protected
 * @method parseBibTeXType
 *
 * @param {String} pubType - BibTeX type
 *
 * @return {String} CSL type
 */
const parseBibTeXType = function (pubType) {
  switch (pubType) {
    case 'article':
      return 'article-journal'

    case 'book':
    case 'booklet':
    case 'manual':
    case 'misc':
    case 'proceedings':
      return 'book'

    case 'inbook':
    case 'incollection':
      return 'chapter'

    case 'conference':
    case 'inproceedings':
      return 'paper-conference'

    case 'online':
      return 'webpage'

    case 'patent':
      return 'patent'

    case 'phdthesis':
    case 'mastersthesis':
      return 'thesis'

    case 'techreport':
      return 'report'

    case 'unpublished':
      return 'manuscript'

    default:
      console.warn('[set]', `BibTeX publication type not recognized: ${pubType}. Interpreting as "book".`)
      return 'book'
  }
}

export default parseBibTeXType
