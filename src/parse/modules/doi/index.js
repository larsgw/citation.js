/**
 * @module input/doi
 */

import * as id from './id'
import * as api from './api'
import * as json from './json'
import * as type from './type'

export const scope = '@doi'
export const parsers = {id, api, json, type}
export const types = {
  '@doi/api': {
    dataType: 'String',
    predicate: /^\s*(https?:\/\/(?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+))\s*$/i
  },
  '@doi/id': {
    dataType: 'String',
    predicate: /^\s*(10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*$/i
  },
  '@doi/list+text': {
    dataType: 'String',
    predicate: /^\s*(?:(?:10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*)+$/i
  },
  '@doi/list+object': {
    dataType: 'Array',
    elementConstraint: '@doi/id'
  }
}
