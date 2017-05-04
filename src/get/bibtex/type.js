/**
 * CSL pub type to BibTeX pub type
 * 
 * @access private
 * @method fetchBibTeXType
 * 
 * @param {String} pubType - CSL type
 * 
 * @return {String} BibTeX type
 */
var fetchBibTeXType = function ( pubType ) {
  
  switch ( pubType ) {
    case 'article':
    case 'article-journal':
    case 'article-magazine':
    case 'article-newspaper':
      return 'article';
      break;
    
    case 'book':
      return 'book';
      break;
    
    case 'chapter':
      return 'incollection';
      break;
    
    case 'manuscript':
      return 'unpublished';
      break;
    
    case 'paper-conference':
      return 'inproceedings';
      break;
    
    case 'patent':
      return 'patent';
      break;
    
    case 'report':
      return 'techreport';
      break;
    
    case 'thesis':
      return 'phdthesis'
      break;
    
    case 'graphic':
    case 'interview':
    case 'motion_picture':
    case 'personal_communication':
    case 'webpage':
      return 'misc';
      break;
    
    default:
      console.warn( 'CSL publication type not recognized: ' + pubType + '. Interpreting as "misc".' )
      return 'misc';
      break;
  }
}

export default fetchBibTeXType