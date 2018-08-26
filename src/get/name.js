/**
 * Get name from CSL
 *
 * @access protected
 * @memberof Cite.get
 *
 * @param {Object} name - CSL input
 * @param {Boolean} [reversed=false] - output name as 'family, given'
 *
 * @return {String} Full name
 */
import {format as getName} from '@citation-js/name'

export default getName
