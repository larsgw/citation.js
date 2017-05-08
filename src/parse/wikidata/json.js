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
 * @return {CSL[]} The formatted input data
 */
const parseWikidataJSON = function (data) {
  return Object.keys(data.entities).map((entityKey) => {
    const {labels, claims} = data.entities[entityKey]
    const entity = wdk.simplifyClaims(claims, null, null, true)
    const json = {
      wikiId: entityKey,
      id: entityKey
    }

    Object.keys(entity).forEach((prop) => {
      const value = entity[prop]
      const [resProp, resValue] = parseWikidataProp(prop, value, 'en')
      if (resProp.length > 0) {
        json[resProp] = resValue
      }
    })

    // It still has to combine authors from string value and numeric-id value :(
    if (json.hasOwnProperty('authorQ') || json.hasOwnProperty('authorS')) {
      if (json.hasOwnProperty('authorQ') && json.hasOwnProperty('authorS')) {
        json.author = json.authorQ.concat(json.authorS)
        delete json.authorQ
        delete json.authorS
      } else if (json.hasOwnProperty('authorQ')) {
        json.author = json.authorQ
        delete json.authorQ
      } else if (json.hasOwnProperty('authorS')) {
        json.author = json.authorS
        delete json.authorS
      }
      json.author = json.author.sort((a, b) => a[1] - b[1]).map(v => v[0])
    }

    if (!json.title) {
      json.title = labels['en'].value
    }

    return json
  })
}

export default parseWikidataJSON
