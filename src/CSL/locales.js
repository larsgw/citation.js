/**
 * Object containing CSL locales
 *
 * Locales from the [CSL Project](http://citationstyles.org/)<br>
 * [REPO](https://github.com/citation-style-language/locales)
 *
 * Accesed 10/22/2016
 *
 * @access private
 * @constant varCSLLocales
 * @default
 */
import varCSLLocales from './locales.json'

/**
 * Retrieve CSL locale
 *
 * @access protected
 * @method fetchCSLLocale
 *
 * @param {String} lang - lang code
 *
 * @return {String} CSL locale
 */
const fetchCSLLocale = lang => varCSLLocales[lang]

export default fetchCSLLocale
