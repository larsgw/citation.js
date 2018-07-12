import '@babel/polyfill'
import './logger'

import * as staticMethods from './Cite/static'
import * as plugins from './plugins/index'
import * as get from './get/index'
import * as parse from './parse/index'
import * as util from './util/index'
import * as version from './version'
import Cite from './Cite/index'

// BEGIN compat
import {default as locale, locales} from './get/modules/csl/locales'
import {default as style, templates} from './get/modules/csl/styles'
import {fetchEngine as engine} from './get/modules/csl/engines'

const CSL = {
  engine,
  style,
  locale,
  /* istanbul ignore next: deprecated */
  item (data) { return id => data.find(entry => entry.id === id) },
  register: {
    addTemplate: templates.add.bind(templates),
    getTemplate: templates.get.bind(templates),
    hasTemplate: templates.has.bind(templates),
    addLocale: locales.add.bind(locales),
    getLocale: locales.get.bind(locales),
    hasLocale: locales.has.bind(locales)
  }
}
// END compat

Object.assign(Cite, staticMethods, {
  plugins,
  get,
  CSL,
  parse,
  util,
  version,
  input: parse.chain,
  inputAsync: parse.chainAsync
})

module.exports = Cite
