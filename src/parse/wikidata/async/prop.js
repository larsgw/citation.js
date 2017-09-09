import wdk from 'wikidata-sdk'
import fetchFileAsync from '../../../util/fetchFileAsync'

import parseWikidataProp from '../prop'
import parseName from '../../name'

/**
 * Get the names of objects from Wikidata IDs (async)
 *
 * @access private
 * @method fetchWikidataLabelAsync
 *
 * @param {String|Array<String>} q - Wikidata IDs
 * @param {String} lang - Language
 *
 * @return {Array<String>} Array with labels of each prop
 */
const fetchWikidataLabelAsync = async function (q, lang) {
  const ids = Array.isArray(q) ? q : typeof q === 'string' ? q.split('|') : ''
  const url = wdk.getEntities(ids, [lang], 'labels')
  const entities = JSON.parse(await fetchFileAsync(url)).entities || {}

  return Object.keys(entities).map(entityKey => (entities[entityKey].labels[lang] || {}).value)
}

const parseWikidataP1545 = qualifiers => qualifiers.P1545 ? parseInt(qualifiers.P1545[0]) : -1

/**
 * Transform property and value from Wikidata format to CSL (async).
 *
 * Returns additional _ordinal property on authors.
 *
 * @access protected
 * @method parseWikidataPropAsync
 *
 * @param {String} prop - Property
 * @param {String|Number} value - Value
 * @param {String} lang - Language
 *
 * @return {Array<String>} Array with new prop and value
 */
const parseWikidataPropAsync = async function (prop, value, lang) {
  const cslValue = await (async (prop, valueList) => {
    const value = valueList[0].value

    switch (prop) {
      case 'P50':
      case 'P57':
      case 'P86':
      case 'P98':
      case 'P110':
      case 'P655':
        return Promise.all(valueList.map(async ({value, qualifiers}) => {
          const name = parseName((await fetchWikidataLabelAsync(value, lang))[0])
          name._ordinal = parseWikidataP1545(qualifiers)
          return name
        }))

      case 'P123':
      case 'P136':
      case 'P291':
      case 'P1433':
        return (await fetchWikidataLabelAsync(value, lang))[0]
    }
  })(prop, value)

  if (cslValue) {
    return [parseWikidataProp(prop), cslValue]
  } else {
    return parseWikidataProp(prop, value, lang)
  }
}

export default parseWikidataPropAsync
