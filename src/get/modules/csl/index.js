/**
 * @module output/csl
 */

import './locales'
import './styles'

import bibliography from './bibliography'
import citation from './citation'

/**
 * @callback module:output/csl~retrieveItem
 * @param {String} id - Citation id
 * @return {CSL} CSL Citation object
 */

/**
 * @callback module:output/csl~retrieveLocale
 * @param {String} lang - Language code
 * @return {String} CSL Locale
 */

export default [{
  name: 'bibliography',
  formatter: bibliography
}, {
  name: 'citation',
  formatter: citation
}]
