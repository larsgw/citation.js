import CSL from 'citeproc'

/**
 * Object containing CSL Engines
 * 
 * @access private
 * @constant varCSLEngines
 * @default
 */
var varCSLEngines = {}

/**
 * @callback Cite~retrieveItem
 * @param {String} id - Citation id
 * @return {CSL} CSL Citation object
 */

/**
 * @callback Cite~retrieveLocale
 * @param {String} lang - Language code
 * @return {String} CSL Locale
 */

/**
 * Retrieve CSL parsing engine
 * 
 * @access private
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
var fetchCSLEngine = function ( style, lang, template, retrieveItem, retrieveLocale ) {
  var prop = style + '|' + lang
    , engine
  
  if ( varCSLEngines.hasOwnProperty( prop ) )
    engine = varCSLEngines[ prop ],
    engine.sys.retrieveItem = retrieveItem
  else
    engine = varCSLEngines[ prop ] = new CSL.Engine( { retrieveLocale: retrieveLocale, retrieveItem: retrieveItem }, template, lang, true )
  
  return engine
}

export default fetchCSLEngine