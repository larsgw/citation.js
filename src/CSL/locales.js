import { getLocale as getCustomLocale, hasLocale as hasCustomLocale } from './register'

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
 * @param {String} [lang="en-US"] - lang code
 *
 * @return {String} CSL locale
 */
const fetchCSLLocale = lang => hasCustomLocale(lang)
  ? getCustomLocale(lang)
  : varCSLLocales.hasOwnProperty(lang)
  ? varCSLLocales[lang]
  : varCSLLocales['en-US']

export default fetchCSLLocale
