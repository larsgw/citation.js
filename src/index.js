import 'babel-polyfill'
import './logger'

import * as staticMethods from './Cite/static'
import * as get from './get/index'
import * as CSL from './CSL/index'
import * as parse from './parse/index'
import * as util from './util/index'
import * as version from './version'
import async from './async/index'
import Cite from './Cite/index'

Object.assign(Cite, staticMethods, {
  async: async,
  get,
  CSL,
  parse,
  util,
  version,
  input: parse.input.chain,
  inputAsync: parse.input.async.chain
})

module.exports = Cite
