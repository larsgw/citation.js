import getBibTeXLabel from './bibtex/label'

/**
 * Get a label from CSL data
 *
 * @access protected
 * @method getLabel
 *
 * @param {CSL} src - Input CSL
 *
 * @return {String} The label
 */
const getLabel = (src) => getBibTeXLabel(src)

export default getLabel
