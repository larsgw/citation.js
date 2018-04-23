/**
 * @module input/bibtex
 */

import * as text from './text'
import * as json from './json'
import * as prop from './prop'
import * as type from './type'
import * as bibtxt from './bibtxt'

export const scope = '@bibtex'
export const parsers = {text, json, prop, type, bibtxt}
export const types = {
  '@bibtex/text': {
    dataType: 'String',
    predicate: /^(?:\s*@\s*[^@]+?\s*\{\s*[^@]+?\s*,\s*[^@]+\})+\s*$/
  },
  '@bibtxt/text': {
    dataType: 'String',
    predicate: /^\s*(\[(?!\s*[{[]).*?\]\s*(\n\s*[^[]((?!:)\S)+\s*:\s*.+?\s*)*\s*)+$/
  },
  '@bibtex/object': {
    dataType: 'SimpleObject',
    propertyConstraint: {props: ['type', 'label', 'properties']}
  }
}
