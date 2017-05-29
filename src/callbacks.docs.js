/**
 * Small file to instantiate callbacks with descriptions for the code.
 */

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
 * @callback Cite~sort
 * @param {CSL} a - element a
 * @param {CSL} b - element b
 * @return {Number} positive for a > b, negative for b > a, zero for a = b
 */
