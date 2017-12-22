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
    parseType: input => input === ''
  },
  '@empty/whitespace+text': {
    dataType: 'String',
    parseType: /^\s+$/
  },
  '@empty': {
    dataType: 'Primitive',
    parseType: input => input == null
  },
  '@else/json': {
    dataType: 'String',
    parseType: /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/
  },
  '@else/url': {
    dataType: 'String',
    parseType: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  },
  '@else/jquery': {
    dataType: 'ComplexObject',
    parseType: input => typeof jQuery !== 'undefined' && input instanceof jQuery
  },
  '@else/html': {
    dataType: 'ComplexObject',
    parseType: input => typeof HTMLElement !== 'undefined' && input instanceof HTMLElement
  }
}
