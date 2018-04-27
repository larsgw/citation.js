/**
 * @module input/wikidata
 */

import wdk from 'wikidata-sdk'
import {
  parse as parseWikidataProp,
  parseAsync as parseWikidataPropAsync
} from './prop'

/**
 * Format Wikidata data (async)
 *
 * @access protected
 * @method parseWikidataJSONAsync
 *
 * @param {Object} data - The input data
 *
 * @return {Promise<Array<CSL>>} The formatted input data
 */
const parseWikidataJSONAsync = async function (data) {
  return Promise.all(Object.keys(data.entities).map(async function (entityKey) {
    const {labels, claims} = data.entities[entityKey]
    const entity = wdk.simplifyClaims(claims, null, null, true)
    const json = {
      _wikiId: entityKey,
      id: entityKey
    }

    await Promise.all(Object.keys(entity).map(async prop => {
      const field = await parseWikidataPropAsync(prop, entity[prop], 'en')
      if (field) {
        const [fieldName, fieldValue] = field

        if (Array.isArray(json[fieldName])) {
          json[fieldName] = json[fieldName].concat(fieldValue)
        } else if (fieldValue !== undefined) {
          json[fieldName] = fieldValue
        }
      }
    }))

    if (Array.isArray(json.author)) {
      json.author.sort(({_ordinal: a}, {_ordinal: b}) => a - b)
    }

    if (!json.title) {
      json.title = labels['en'].value
    }

    return json
  }))
}

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

export {
  parseWikidataJSON as parse,
  parseWikidataJSONAsync as parseAsync,
  parseWikidataJSON as default
}
