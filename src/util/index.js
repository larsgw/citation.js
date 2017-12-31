/**
 * @namespace util
 * @memberof Cite
 */

import deepCopy from './deepCopy'
import fetchFile from './fetchFile'
import fetchFileAsync from './fetchFileAsync'
import fetchId from './fetchId'
import TokenStack from './stack'
import Register from './register'

// BEGIN compat
import {getAttributedEntry, getPrefixedEntry} from '../get/modules/csl/attr'
import {getWrappedEntry} from '../get/modules/csl/affix'

/**
 * @namespace attr
 * @memberof Cite.util
 * @deprecated now part of the {@link module:output/csl} module
 *
 * @borrows module:output/csl~getAttributedEntry as getAttributedEntry
 * @borrows module:output/csl~getPrefixedEntry as getPrefixedEntry
 * @borrows module:output/csl~getWrappedEntry as getWrappedEntry
 */
const attr = {getAttributedEntry, getPrefixedEntry, getWrappedEntry}
// END compat

export {attr, deepCopy, fetchFile, fetchFileAsync, fetchId, TokenStack, Register}
