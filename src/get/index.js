/**
 * @namespace get
 * @memberof Cite
 */

import * as dict from './dict'
import date from './date'
import name from './name'

import './modules/'

// BEGIN compat
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
// END compat

export {date, name, dict}

export * from './registrar'
