/**
 * @namespace CSL
 * @memberof Cite
 */

import style from './styles'
import locale from './locales'
import engine from './engines'
import item from './items'
import * as register from './register'

/**
 * @callback Cite.CSL~retrieveItem
 * @param {String} id - Citation id
 * @return {CSL} CSL Citation object
 */

/**
 * @callback Cite.CSL~retrieveLocale
 * @param {String} lang - Language code
 * @return {String} CSL Locale
 */

export { style, locale, engine, item, register }
