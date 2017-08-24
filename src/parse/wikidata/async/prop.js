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
 * Transform property and value from Wikidata format to CSL (async)
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
  const cslValue = await (async (prop, value) => {
    switch (prop) {
      case 'P50':
        return Promise.all(value.map(async ({value, qualifiers}) => [
          parseName((await fetchWikidataLabelAsync(value, lang))[0]),
          parseWikidataP1545(qualifiers)
        ]))

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
