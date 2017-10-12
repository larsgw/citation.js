import * as list from './list'
import * as json from './json'
import * as prop from './prop'
import * as type from './type'

import {type as parseType} from '../../register'

export const scope = '@wikidata'
export const parsers = {list, json, prop, type}
export const types = {
  '@wikidata/id': {
    dataType: 'String',
    parseType: /^\s*(Q\d+)\s*$/
  },
  '@wikidata/list+text': {
    dataType: 'String',
    parseType: /^\s*((?:Q\d+(?:\s+|,|))*Q\d+)\s*$/
  },
  '@wikidata/api': {
    dataType: 'String',
    parseType: /^(https?:\/\/(?:www\.)?wikidata.org\/w\/api\.php(?:\?.*)?)$/
  },
  '@wikidata/url': {
    dataType: 'String',
    parseType: /\/(Q\d+)(?:[#?/]|\s*$)/
  },
  '@wikidata/array': {
    dataType: 'Array',
    parseType: input => input.every(v => parseType(v) === '@wikidata/id')
  },
  '@wikidata/object': {
    dataType: 'SimpleObject',
    parseType: input => input && input.hasOwnProperty('entities')
  }
}
