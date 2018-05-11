/* global jQuery, HTMLElement */

/**
 * @module input/other
 */

import * as empty from './empty'
import * as url from './url'
import * as json from './json'
import * as jquery from './jquery'
import * as html from './html'

export const ref = '@else'
export const parsers = {empty, url, json, jquery, html}
export const formats = {
  '@empty/text': {
    parse: empty.parse,
    parseType: {
      dataType: 'String',
      predicate: input => input === ''
    }
  },
  '@empty/whitespace+text': {
    parse: empty.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s+$/
    }
  },
  '@empty': {
    parse: empty.parse,
    parseType: {
      dataType: 'Primitive',
      predicate: input => input == null
    }
  },
  '@else/json': {
    parse: json.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(\{[\S\s]*\}|\[[\S\s]*\])\s*$/
    }
  },
  '@else/url': {
    parse: url.parse,
    parseAsync: url.parseAsync,
    parseType: {
      dataType: 'String',
      predicate: /^https?:\/\/(([\w-]+\.)*[\w-]+)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
    }
  },
  '@else/jquery': {
    parse: jquery.parse,
    parseType: {
      dataType: 'ComplexObject',
      predicate: input => typeof jQuery !== 'undefined' && input instanceof jQuery
    }
  },
  '@else/html': {
    parse: html.parse,
    parseType: {
      dataType: 'ComplexObject',
      predicate: input => typeof HTMLElement !== 'undefined' && input instanceof HTMLElement
    }
  }
}
