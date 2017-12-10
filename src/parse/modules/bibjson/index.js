/**
 * @module input/bibjson
 */

import * as json from './json'

export const scope = '@bibjson'
export const parsers = {json}
export const types = {
  '@bibjson/object': {
    dataType: 'SimpleObject',
    propertyConstraint: {
      props: ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'],
      match: 'some',
      value: val => val && Array.isArray(val.value)
    }
  }
}
