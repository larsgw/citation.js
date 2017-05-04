/**
 * BibTeX pub type to CSL pub type
 * 
 * @access private
 * @method parseBibTeXType
 * 
 * @param {String} pubType - BibTeX type
 * 
 * @return {String} CSL type
 */
var parseBibTeXType = function ( pubType ) {
  switch ( pubType ) {
    
    case 'article':
      return 'article-journal';
      break;
    
    case 'book':
    case 'booklet':
    case 'manual':
    case 'misc':
    case 'proceedings':
      return 'book';
      break;
    
    case 'inbook':
    case 'incollection':
      return 'chapter';
      break;
    
    case 'conference':
    case 'inproceedings':
      return 'paper-conference';
      break;
    
    case 'online':
      return 'webpage'
      break;
    
    case 'patent':
      return 'patent';
      break;
    
    case 'phdthesis':
    case 'mastersthesis':
      return 'thesis';
      break;
    
    case 'techreport':
      return 'report';
      break;
    
    case 'unpublished':
      return 'manuscript';
      break;
    
    default:
      console.warn( 'BibTeX publication type not recognized: ' + pubType + '. Interpreting as "book".' )
      return 'book';
      break;
  }
}

export default parseBibTeXType