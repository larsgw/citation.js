/**
 * Get CSL from name
 *
 * @access protected
 * @memberof Cite.parse
 *
 * @param {String} name - string
 *
 * @return {Object} The CSL object
 */
import {parse as parseName} from '@citation-js/name'

export const scope = '@name'
export const types = '@name'
export {
  parseName as parse,
  parseName as default
}
