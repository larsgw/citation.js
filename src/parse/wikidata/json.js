import wdk from 'wikidata-sdk'
import parseWikidataProp from './prop'

/**
 * Format Wikidata data
 *
 * @access protected
 * @method parseWikidataJSON
 *
 * @param {Object} data - The input data
 *
 * @return {Array<CSL>} The formatted input data
 */
const parseWikidataJSON = function (data) {
  return Object.keys(data.entities).map((entityKey) => {
    const {labels, claims} = data.entities[entityKey]
    const entity = wdk.simplifyClaims(claims, null, null, true)
    const json = {
      _wikiId: entityKey,
      id: entityKey
    }

    Object.keys(entity).forEach((prop) => {
      const field = parseWikidataProp(prop, entity[prop], 'en')
      if (field) {
        const [fieldName, fieldValue] = field

        if (Array.isArray(json[fieldName])) {
          json[fieldName] = json[fieldName].concat(fieldValue)
        } else if (fieldValue !== undefined) {
          json[fieldName] = fieldValue
        }
      }
    })

    if (Array.isArray(json.author)) {
      json.author.sort(({_ordinal: a}, {_ordinal: b}) => a - b)
    }

    if (!json.title) {
      json.title = labels['en'].value
    }

    return json
  })
}

export default parseWikidataJSON
