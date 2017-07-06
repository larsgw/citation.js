import wdk from 'wikidata-sdk'
import fetchFileAsync from '../../../util/fetchFileAsync'

import fetchWikidataType from '../type'
import parseDate from '../../date'
import parseName from '../../name'

/**
 * Get the names of objects from Wikidata IDs (async)
 *
 * @access private
 * @method fetchWikidataLabelAsync
 *
 * @param {String|String[]} q - Wikidata IDs
 * @param {String} lang - Language
 *
 * @return {String[]} Array with labels of each prop
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
 * @return {String[]} Array with new prop and value
 */
const parseWikidataPropAsync = async function (prop, value, lang) {
  switch (prop) {
    case 'P50':
    case 'P2093':
      value = value.slice()
      break

    default:
      value = value.length ? value[0].value : undefined
      break
  }

  let rProp = ''
  let rValue = value

  switch (prop) {
    // Author ( q )
    case 'P50':
      rProp = 'authorQ'
      rValue = await Promise.all(value.map(async function ({value, qualifiers}) {
        return [
          parseName((await fetchWikidataLabelAsync(value, lang))[0]),
          parseWikidataP1545(qualifiers)
        ]
      }))
      break

    // Author ( s )
    case 'P2093':
      rProp = 'authorS'
      rValue = value.map(({value, qualifiers}) => [parseName(value), parseWikidataP1545(qualifiers)])
      break

    // Date
    case 'P580':
    case 'P585':
      rProp = 'accessed'
      rValue = parseDate(value)
      break

    // DOI
    case 'P356':
      rProp = 'DOI'
      break

    // Instance of
    case 'P31':
      rProp = 'type'
      rValue = fetchWikidataType(value)

      if (rValue === undefined) {
        console.warn('[set]', `This entry type is not recognized and therefore interpreted as 'article-journal': ${value}`)
        rValue = 'article-journal'
      }
      break

    // ISBN 13 & 10
    case 'P212':
    case 'P957':
      rProp = 'ISBN'
      break

    // Issue
    case 'P433':
      rProp = 'issue'
      break

    // Journal
    case 'P1433':
      rProp = 'container-title'
      rValue = (await fetchWikidataLabelAsync(value, lang))[0]
      break

    // Pages
    case 'P304':
      rProp = 'page'
      break

    // Print/edition
    case 'P393':
      rProp = 'edition'
      break

    // Pubdate
    case 'P577':
      rProp = 'issued'
      rValue = parseDate(value)
      break

    // Title
    case 'P1476':
      rProp = 'title'
      break

    // URL
    case 'P953': // (full work available at)
      rProp = 'URL'
      break

    // Volume
    case 'P478':
      rProp = 'volume'
      break

    case 'P2860': // Cites
    case 'P921':  // Main subject
    case 'P3181': // OpenCitations bibliographic resource ID
    case 'P364':  // Original language of work
    case 'P698':  // PMID
    case 'P932':  // PMCID
    case 'P1104': // Number of pages
      // Property ignored
      break

    default:
      console.info('[set]', `Unknown property: ${prop}`)
      break
  }

  return [rProp, rValue]
}

export default parseWikidataPropAsync
