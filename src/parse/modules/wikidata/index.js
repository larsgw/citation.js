import * as list from './list'
import * as json from './json'
import * as prop from './prop'
import * as type from './type'
import * as url from './url'
import * as api from './api'

export const scope = '@wikidata'
export const parsers = {list, json, prop, type, url, api}
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
    elementConstraint: '@wikidata/id'
  },
  '@wikidata/object': {
    dataType: 'SimpleObject',
    propertyConstraint: {props: 'entities'}
  }
}
