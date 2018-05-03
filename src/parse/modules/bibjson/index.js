/**
 * @module input/bibjson
 */

import * as json from './json'

export const ref = '@bibjson'
export const parsers = {json}
export const formats = {
  '@bibjson/object': {
    parse: json.parse,
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'],
        match: 'some',
        value: val => val && Array.isArray(val.value)
      }
    }
  }
}
