/**
 * @module input/bibtex
 */

import * as text from './text'
import * as json from './json'
import * as prop from './prop'
import * as type from './type'
import * as bibtxt from './bibtxt'

export const ref = '@bibtex'
export const parsers = {text, json, prop, type, bibtxt}
export const formats = {
  '@bibtex/text': {
    parse: text.parse,
    parseType: {
      dataType: 'String',
      predicate: /@\s{0,5}[A-Za-z]{1,13}\s{0,5}\{\s{0,5}[^@{}"=,\\\s]{0,100}\s{0,5},[\s\S]*\}/
    }
  },
  '@bibtxt/text': {
    parse: bibtxt.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(\[(?!\s*[{[]).*?\]\s*(\n\s*[^[]((?!:)\S)+\s*:\s*.+?\s*)*\s*)+$/
    }
  },
  '@bibtex/object': {
    parse: json.parse,
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {props: ['type', 'label', 'properties']}
    }
  },
  '@bibtex/prop': {
    parse: prop.parse
  },
  '@bibtex/type': {
    parse: type.parse
  }
}
