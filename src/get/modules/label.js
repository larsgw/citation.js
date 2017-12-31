/**
 * @module output/label
 * @todo requires {@link module:output/bibtex}, which isn't really modular
 */

import getBibtexLabel from './bibtex/label'

/**
 * Get a label from CSL data
 *
 * @access protected
 * @memberof Cite.get
 * @todo flavors/formats
 *
 * @param {CSL} src - Input CSL
 *
 * @return {String} The label
 */
const getLabel = getBibtexLabel

export {getLabel}
export default [{
  name: 'label',
  formatter (data) {
    return data.reduce((object, entry) => { object[entry.id] = getLabel(entry); return object }, {})
  }
}]
