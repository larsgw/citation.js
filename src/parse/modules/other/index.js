/* global jQuery, HTMLElement */

/**
 * @module input/other
 */

import * as empty from './empty'
import * as url from './url'
import * as json from './json'
import * as jquery from './jquery'
import * as html from './html'

export const scope = '@else'
export const parsers = {empty, url, json, jquery, html}
export const types = {
  '@empty/text': {
    dataType: 'String',
    predicate: input => input === ''
  },
  '@empty/whitespace+text': {
    dataType: 'String',
    predicate: /^\s+$/
  },
  '@empty': {
    dataType: 'Primitive',
    predicate: input => input == null
  },
  '@else/json': {
    dataType: 'String',
    predicate: /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/
  },
  '@else/url': {
    dataType: 'String',
    predicate: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  },
  '@else/jquery': {
    dataType: 'ComplexObject',
    predicate: input => typeof jQuery !== 'undefined' && input instanceof jQuery
  },
  '@else/html': {
    dataType: 'ComplexObject',
    predicate: input => typeof HTMLElement !== 'undefined' && input instanceof HTMLElement
  }
}
