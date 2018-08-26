/**
 * Convert a CSL date into human-readable format
 *
 * @access protected
 * @memberof Cite.get
 *
 * @param {Object} date - A date in CSL format
 * @param {String} [delimiter='-'] - Date part delimiter
 *
 * @return {String} The string
 */
import {format as getDate} from '@citation-js/date'

export default getDate
