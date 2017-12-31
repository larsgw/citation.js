/**
 * @module output/csl
 */

/**
 * @namespace CSL
 * @memberof Cite
 */

import './locales'
import './styles'

import bibliography from './bibliography'
// import citation from './citation'

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

export default [{
  name: 'bibliography',
  formatter: bibliography
}/* , {
  name: 'citation',
  formatter: citation
} */]
