import CSL from 'citeproc'

/**
 * Object containing CSL Engines
 *
 * @access private
 * @constant
 * @memberof Cite.CSL
 * @default
 */
const varCSLEngines = {}

/**
 * Retrieve CSL parsing engine
 *
 * @access protected
 * @method engine
 * @memberof Cite.CSL
 *
 * @param {String} style - CSL style id
 * @param {String} lang - Language code
 * @param {String} template - CSL XML template
 * @param {Cite.CSL~retrieveItem} retrieveItem - Code to retreive item
 * @param {Cite.CSL~retrieveLocale} retrieveLocale - Code to retreive locale
 *
 * @return {Object} CSL Engine
 */
const fetchCSLEngine = function (style, lang, template, retrieveItem, retrieveLocale) {
  const prop = `${style}|${lang}`
  let engine

  if (varCSLEngines.hasOwnProperty(prop)) {
    engine = varCSLEngines[prop]
    engine.sys.retrieveItem = retrieveItem
  } else {
    engine = varCSLEngines[prop] = new CSL.Engine({retrieveLocale, retrieveItem}, template, lang, true)
  }

  return engine
}

export default fetchCSLEngine
