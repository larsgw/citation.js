/**
 * @module input/wikidata
 */

import * as list from './list'
import * as json from './json'
import * as prop from './prop'
import * as type from './type'
import * as url from './url'
import * as api from './api'

export const ref = '@wikidata'
export const parsers = {list, json, prop, type, url, api}
export const formats = {
  '@wikidata/id': {
    parse: list.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(Q\d+)\s*$/
    }
  },
  '@wikidata/list+text': {
    parse: list.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*((?:Q\d+(?:\s+|,|))*Q\d+)\s*$/
    }
  },
  '@wikidata/api': {
    parse: api.parse,
    parseAsync: api.parseAsync,
    parseType: {
      dataType: 'String',
      predicate: /^(https?:\/\/(?:www\.)?wikidata.org\/w\/api\.php(?:\?.*)?)$/,
      extends: '@else/url'
    }
  },
  '@wikidata/url': {
    parse: url.parse,
    parseType: {
      dataType: 'String',
      predicate: /\/(Q\d+)(?:[#?/]|\s*$)/,
      extends: '@else/url'
    }
  },
  '@wikidata/list+object': {
    parse: list.parse,
    parseType: {
      dataType: 'Array',
      elementConstraint: '@wikidata/id'
    }
  },
  '@wikidata/object': {
    parse: json.parse,
    parseAsync: json.parseAsync,
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {props: 'entities'}
    }
  },
  '@wikidata/prop': {
    parse: prop.parse
  },
  '@wikidata/type': {
    parse: type.parse
  }
}
