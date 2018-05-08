/**
 * @module input/doi
 */

import * as id from './id'
import * as api from './api'
import * as json from './json'
import * as type from './type'

export const ref = '@doi'
export const parsers = {id, api, json, type}
export const formats = {
  '@doi/api': {
    parse: api.parse,
    parseAsync: api.parseAsync,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(https?:\/\/(?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+))\s*$/i,
      extends: '@else/url'
    }
  },
  '@doi/id': {
    parse: id.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*$/i
    }
  },
  '@doi/list+text': {
    parse: id.parse,
    parseType: {
      dataType: 'String',
      tokenList: /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    }
  },
  '@doi/list+object': {
    parse: id.parse,
    parseType: {
      dataType: 'Array',
      elementConstraint: '@doi/id'
    }
  },
  '@doi/type': {
    parse: type.parse
  }
}
