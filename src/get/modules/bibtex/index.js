/**
 * @module output/bibtex
 */

import {has as hasDict, get as getDict} from '../../dict'
import json from './json'
import {getBibtex} from './text'
import {getBibtxt} from './bibtxt'

const factory = function (formatter) {
  return function (data, {type, format = type || 'text'} = {}) {
    if (format === 'object') {
      return data.map(json)
    } else {
      return hasDict(format) ? formatter(data, getDict(format)) : ''
    }
  }
}

export default {
  bibtex: factory(getBibtex),
  bibtxt: factory(getBibtxt)
}
