/**
 * @module output/label
 */

import getBibtexLabel from './bibtex/label'

/**
 * Get a label from CSL data
 *
 * @access protected
 * @method getLabel
 * @todo flavors/formats
 *
 * @param {CSL} src - Input CSL
 *
 * @return {String} The label
 */
const getLabel = getBibtexLabel

export {getLabel}
export default {
  label (data) {
    return data.reduce((object, entry) => { object[entry.id] = getLabel(entry); return object }, {})
  }
}
