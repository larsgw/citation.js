import CSL from 'citeproc'

/**
 * Object containing CSL Engines
 *
 * @access private
 * @constant varCSLEngines
 * @default
 */
const varCSLEngines = {}

/**
 * Retrieve CSL parsing engine
 *
 * @access protected
 * @method fetchCSLEngine
 *
 * @param {String} style - CSL style id
 * @param {String} lang - Language code
 * @param {String} template - CSL XML template
 * @param {Cite~retrieveItem} retrieveItem - Code to retreive item
 * @param {Cite~retrieveLocale} retrieveLocale - Code to retreive locale
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
