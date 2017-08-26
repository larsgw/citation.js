import parseName from './name'

const NAME = 1
const NAME_LIST = 2
const DATE = 3

/**
 * Object containing type info on CSL-JSON fields.
 *
 * * string: primitive value type
 * * array: list of primitive value types
 * * number: special type
 *
 * Data from https://github.com/citation-style-language/schema/blob/master/csl-data.json
 *
 * @access private
 * @constant fieldTypes
 * @default
 */
const fieldTypes = {
  author: NAME_LIST,
  'collection-editor': NAME_LIST,
  composer: NAME_LIST,
  'container-author': NAME_LIST,
  editor: NAME_LIST,
  'editorial-director': NAME_LIST,
  director: NAME_LIST,
  interviewer: NAME_LIST,
  illustrator: NAME_LIST,
  'original-author': NAME_LIST,
  'reviewed-author': NAME_LIST,
  recipient: NAME_LIST,
  translator: NAME_LIST,

  accessed: DATE,
  container: DATE,
  'event-date': DATE,
  issued: DATE,
  'original-date': DATE,
  submitted: DATE,

  categories: 'object', // TODO Array<String>

  id: ['string', 'number'],
  type: 'string',
  language: 'string',
  journalAbbreviation: 'string',
  shortTitle: 'string',
  abstract: 'string',
  annote: 'string',
  archive: 'string',
  archive_location: 'string',
  'archive-place': 'string',
  authority: 'string',
  'call-number': 'string',
  'chapter-number': 'string',
  'citation-number': 'string',
  'citation-label': 'string',
  'collection-number': 'string',
  'collection-title': 'string',
  'container-title': 'string',
  'container-title-short': 'string',
  dimensions: 'string',
  DOI: 'string',
  edition: ['string', 'number'],
  event: 'string',
  'event-place': 'string',
  'first-reference-note-number': 'string',
  genre: 'string',
  ISBN: 'string',
  ISSN: 'string',
  issue: ['string', 'number'],
  jurisdiction: 'string',
  keyword: 'string',
  locator: 'string',
  medium: 'string',
  note: 'string',
  number: ['string', 'number'],
  'number-of-pages': 'string',
  'number-of-volumes': ['string', 'number'],
  'original-publisher': 'string',
  'original-publisher-place': 'string',
  'original-title': 'string',
  page: 'string',
  'page-first': 'string',
  PMCID: 'string',
  PMID: 'string',
  publisher: 'string',
  'publisher-place': 'string',
  references: 'string',
  'reviewed-title': 'string',
  scale: 'string',
  section: 'string',
  source: 'string',
  status: 'string',
  title: 'string',
  'title-short': 'string',
  URL: 'string',
  version: 'string',
  volume: ['string', 'number'],
  'year-suffix': 'string'
}

/**
 * Correct a name.
 *
 * @access private
 * @method correctName
 *
 * @param {*} name - name
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {Object} returns the (corrected) value if possible, otherwise undefined
 */
const correctName = function (name, bestGuessConversions = true) {
  if (typeof name === 'object' && (name.literal || (name.given || name.family))) {
    return name
  } else if (!bestGuessConversions) {
    return undefined
  } else if (typeof name === 'string') {
    return parseName(name)
  }
}

/**
 * Correct a name field.
 *
 * @access private
 * @method correctNameList
 *
 * @param {*} nameList - name list
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {Array<Object>|undefined} returns the (corrected) value if possible, otherwise undefined
 */
const correctNameList = function (nameList, bestGuessConversions = true) {
  if (nameList instanceof Array) {
    return nameList.map(name => correctName(name, bestGuessConversions)).filter(Boolean) || undefined
  }
}

/**
 * Correct a date field.
 *
 * @access private
 * @method correctDate
 *
 * @param {*} date - date
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {Array<Object>|undefined} returns the (corrected) value if possible, otherwise undefined
 */
const correctDate = function (date, bestGuessConversions = true) {
  const dp = 'date-parts'

  // "{'date-parts': [[2000, 1, 1], ...]}"
  if (date && date[dp] instanceof Array && date[dp].every(part => part instanceof Array)) {
    if (date[dp].every(part => part.every(datePart => typeof datePart === 'number'))) {
      return {[dp]: date[dp].map(part => part.slice())}
    } else if (!bestGuessConversions) {
      return undefined
    } else if (date[dp].every(part => part.every(datePart => typeof datePart === 'string'))) {
      return {[dp]: date[dp].map(part => part.map(parseFloat))}
    }

  // LEGACY support
  // "[{'date-parts': [2000, 1, 1]}, ...]"
  } else if (date && date instanceof Array && date[0][dp] instanceof Array) {
    if (date[0][dp].every(datePart => typeof datePart === 'number')) {
      return {[dp]: [date[0][dp].slice()]}
    } else if (!bestGuessConversions) {
      return undefined
    } else if (date[0][dp].every(datePart => typeof datePart === 'string')) {
      return {[dp]: [date[0][dp].map(parseFloat)]}
    }
  }
}

/**
 * Correct a field.
 *
 * @access private
 * @method correctField
 *
 * @param {String} fieldName - field name
 * @param {*} value - value
 * @param {Boolean} [bestGuessConversions=true] - make some best guess conversions on type mismatch, default: true
 *
 * @return {*|undefined} returns the (corrected) value if possible, otherwise undefined
 */
const correctField = function (fieldName, value, bestGuessConversions = true) {
  const fieldType = [].concat(fieldTypes[fieldName])

  switch (fieldTypes[fieldName]) {
    case NAME:
      return correctName(value, bestGuessConversions)
    case NAME_LIST:
      return correctNameList(value, bestGuessConversions)
    case DATE:
      return correctDate(value, bestGuessConversions)
  }

  if (fieldType.includes(typeof value)) {
    return value
  } else if (/^_/.test(value)) {
    return value
  } else if (!bestGuessConversions) {
    return undefined
  } else if (typeof value === 'string' && fieldType.includes('number')) {
    return parseFloat(value)
  } else if (typeof value === 'number' && fieldType.includes('string')) {
    return value.toString()
  } else if (Array.isArray(value) && value.length) {
    return correctField(fieldName, value[0])
  }
}

/**
 * Make CSL JSON conform to standards. This, unfortunately, needs to happen, so it doesn't have to happen anywhere else.
 *
 * @access protected
 * @method parseCsl
 *
 * @param {Array<CSL>} data - Array of CSL
 *
 * @return {Array<CSL>} Array of clean CSL
 */
const parseCsl = function (data) {
  return data.map(function (entry) {
    const clean = {}

    for (let field in entry) {
      const correction = correctField(field, entry[field])
      if (correction !== undefined) {
        clean[field] = correction
      }
    }

    return clean
  })
}

export default parseCsl
