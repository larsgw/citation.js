/**
 * @namespace version
 * @memberof Cite
 */

/**
 * @access public
 * @memberof Cite.version
 *
 * @var {string} cite - Citation.js version
 */
import {version as cite} from '../package.json'

/**
 * @access public
 * @memberof Cite.version
 *
 * @var {string} citeproc - Citeproc-js version
 */
import {PROCESSOR_VERSION as citeproc} from 'citeproc'

export {cite, citeproc}
