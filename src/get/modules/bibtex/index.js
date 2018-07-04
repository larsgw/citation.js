/**
 * @module output/bibtex
 */

import {has as hasDict, get as getDict} from '../../dict'
import json from './json'
import {getBibtex} from './text'
import {getBibtxt} from './bibtxt'

const factory = function (formatter) {
  return function (data, {type = 'text'} = {}) {
    if (type === 'object') {
      return data.map(json)
    } else {
      return hasDict(type) ? formatter(data, getDict(type)) : ''
    }
  }
}

export default {
  bibtex: factory(getBibtex),
  bibtxt: factory(getBibtxt)
}
