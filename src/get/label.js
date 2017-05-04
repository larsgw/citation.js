import getBibTeXLabel from './bibtex/label'

/**
 * Get a label from CSL data
 * 
 * @access private
 * @method getLabel
 * 
 * @param {CSL} src - Input CSL
 * 
 * @return {String} The label
 */
var getLabel = function ( src ) {
  return getBibTeXLabel( src )
}

export default getLabel