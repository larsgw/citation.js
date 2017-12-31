/**
 * @module output/csl
 */

import CSL from 'citeproc'

import fetchStyle from './styles'
import {locales} from './locales'

/**
 * Object containing CSL Engines
 *
 * @access private
 * @constant
 */
const engines = {}

/**
 * Retrieve CSL parsing engine
 *
 * @access protected
 *
 * @param {String} style - CSL style id
 * @param {String} lang - Language code
 * @param {String} template - CSL XML template
 * @param {module:output/csl~retrieveItem} retrieveItem - Code to retreive item
 * @param {module:output/csl~retrieveLocale} retrieveLocale - Code to retreive locale
 *
 * @return {Object} CSL Engine
 */
const fetchEngine = function (style, lang, template, retrieveItem, retrieveLocale) {
  const engineHash = `${style}|${lang}`
  let engine

  if (engines.hasOwnProperty(engineHash)) {
    engine = engines[engineHash]
    engine.sys.retrieveItem = retrieveItem
  } else {
    engine = engines[engineHash] = new CSL.Engine({retrieveLocale, retrieveItem}, template, lang, true)
  }

  return engine
}

/**
 * Prepare CSL parsing engine
 *
 * @access protected
 *
 * @param {Array<CSL>} data
 * @param {String} templateName
 * @param {String} language
 * @param {String} format
 *
 * @return {Object} CSL Engine
 */
const prepareEngine = function (data, templateName, language, format) {
  const items = data.reduce((store, entry) => { store[entry.id] = entry; return store }, {})
  const template = fetchStyle(templateName)
  language = locales.has(language) ? language : 'en-US'

  const engine = fetchEngine(templateName, language, template, key => items[key], locales.get.bind(locales))
  engine.setOutputFormat(format)

  return engine
}

export default prepareEngine
export {fetchEngine}
