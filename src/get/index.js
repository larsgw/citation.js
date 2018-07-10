/**
 * @namespace get
 * @memberof Cite
 *
 * @borrows Cite.plugins.output.register as register
 * @borrows Cite.plugins.output.add as add
 * @borrows Cite.plugins.output.remove as remove
 * @borrows Cite.plugins.output.has as has
 * @borrows Cite.plugins.output.format as format
 */

import date from './date'
import name from './name'

import './modules/'

// BEGIN compat
import * as dict from './dict'

import bibtexJson from './modules/bibtex/json'
import bibtexLabel from './modules/bibtex/label'
import bibtexText from './modules/bibtex/text'
import bibtexType from './modules/bibtex/type'

import bibtxt from './modules/bibtex/bibtxt'
import {getJsonWrapper as json} from './modules/json'
import {getLabel as label} from './modules/label'

export const bibtex = {
  json: bibtexJson,
  label: bibtexLabel,
  text: bibtexText,
  type: bibtexType
}
export {bibtxt, json, label}

/**
 * @namespace dict
 * @memberof Cite.get
 *
 * @deprecated use {@link Cite.plugins.dict}
 * @borrows Cite.plugins.dict.register as register
 * @borrows Cite.plugins.dict.add as add
 * @borrows Cite.plugins.dict.remove as remove
 * @borrows Cite.plugins.dict.has as has
 * @borrows Cite.plugins.dict.get as get
 * @borrows Cite.plugins.dict.htmlDict as htmlDict
 * @borrows Cite.plugins.dict.textDict as textDict
 */
export {dict}
export * from './registrar'
// END compat

export {date, name}
