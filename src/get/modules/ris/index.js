/**
 * @module output/ris
 */

import getName from '../../name'
import getDate from '../../date'

const typeMap = {
  graphic: 'ART',
  bill: 'BILL',
  'post-webblog': 'BLOG',
  book: 'BOOK',
  'review-book': 'BOOK',
  legal_case: 'CASE',
  chapter: 'CHAP',
  'paper-conference': 'CONF',
  dataset: 'DATA',
  'entry-dictionary': 'DICT',
  'entry-encyclopedia': 'ENCYC',
  figure: 'FIGURE',
  interview: 'GEN',
  treaty: 'GEN',
  post: 'ICOMM',
  article: 'JOUR',
  'article-journal': 'JOUR',
  review: 'JOUR',
  legislation: 'LEGAL',
  manuscript: 'MANSCPT',
  map: 'MAP',
  'article-magazine': 'MGZN',
  broadcast: 'MPCT',
  motion_picture: 'MPCT',
  musical_score: 'MUSIC',
  'article-newspaper': 'NEWS',
  pamphlet: 'PAMP',
  patent: 'PAT',
  personal_communication: 'PCOMM',
  report: 'RPRT',
  song: 'SOUND',
  speech: 'SOUND',
  thesis: 'THES'
}

const name = names => names.map(name => getName(name, true))

const fieldMap = {
  // convert
  TY: {fieldName: 'type', convert (type) { return typeMap[type] || 'GEN' }},
  AU: [
    // If it's a review, RIS has a separate field for the reviewers (which are
    // authors in CSL-JSON), while CSL-JSON has a separate field for reviewed
    // authors (which are authors in RIS). See also the C4 mapping
    {type: ['review', 'review-book'], fieldName: 'reviewed-author', convert: name},
    {type: '__default', fieldName: 'author', convert: name}
  ],
  DA: {fieldName: 'issued', convert (date) { return getDate(date, '/') }},
  PY: {fieldName: 'issued', convert (date) { return date['date-parts'][0][0] }},
  Y2: {fieldName: 'accessed', convert (date) { return getDate(date, '/') }},

  // somewhat simple
  AB: 'abstract',
  CN: 'call-number',
  CY: ['event-place', 'publisher-place'],
  DO: 'DOI',
  // TODO Zotero: chapter-number in ET when type = chapter
  ET: [{
    // there is no software type yet, so that's handled here too
    type: 'book',
    fieldName: ['version', 'edition']
  }],
  // TODO Zotero: number-of-volumes in IS when type = chapter
  IS: [{
    type: '__default',
    fieldName: 'issue'
  }],
  J2: ['journalAbbreviation'],
  LA: 'language',
  LB: 'citation-label',
  M1: 'number',
  M3: ['genre', 'medium'],
  N1: 'note',
  RI: 'reviewed-title',
  SE: 'section',
  SN: [{
    type: '__default',
    fieldName: ['ISBN', 'ISSN']
  }, {
    type: ['patent', 'report'],
    fieldName: 'number'
  }],
  // TODO better processing for SP
  SP: {fieldName: ['first-page', 'page']},
  T2: ['container-title', 'collection-title'],
  T3: {
    fieldName: ['container-title', 'collection-title'],
    keepAll: true,
    convert (con, col) {
      return con ? col : undefined
    }
  },
  TI: ['original-title', 'title'],
  TT: {
    fieldName: ['original-title', 'title'],
    keepAll: true,
    convert (origTitle, title) {
      return origTitle ? title : undefined
    }
  },
  UR: 'URL',
  VL: 'volume',

  // composite fields - I'm using whatever's available on
  // https://github.com/aurimasv/translators/wiki/RIS-Tag-Map
  A2: {fieldName: 'editor', convert: name},
  // TODO other author fields
  C1: [
    {type: 'chapter', fieldName: 'section'},
    {type: 'paper-conference', fieldName: 'publisher-place'},
    {type: 'map', fieldName: 'scale'},
    {type: 'musical_score', fieldName: 'medium'}
  ],
  C2: [
    {type: ['article-journal', 'article'], fieldName: 'PMCID'},
    {type: 'paper-conference', fieldName: 'issued', convert (date) { return date['date-parts'][0][0] }},
    {type: 'article-newspaper', fieldName: 'issue'}
  ],
  C3: [
    {type: ['graphic', 'speech', 'sound', 'map'], fieldName: 'dimensions'},
    {type: 'paper-conference', fieldName: 'container-title'}
  ],
  C4: [
    {type: ['review', 'review-book'], fieldName: 'author', convert: name},
    {type: ['motion_picture', 'broadcast'], fieldName: 'genre'}
  ],
  C5: [
    {type: ['graphic', 'speech', 'sound', 'motion_picture', 'broadcast'], fieldName: 'medium'}
  ],
  C6: [
    {type: 'report', fieldName: 'issue'},
    {type: 'patent', fieldName: 'status'}
  ],
  C7: [
    {type: ['article-journal', 'article'], fieldName: 'number'}
  ],

  // debatable
  BT: [{type: 'chapter', fieldName: 'container-title'}],
  DB: 'archive',
  DP: 'source',
  ED: {fieldName: 'editor', convert: name},
  ID: 'id',
  NV: 'number-of-volumes',
  OP: 'references',
  PP: 'publiser-place',
  ST: ['short-title', 'titleShort']
}

const parseFieldInfo = function (fieldInfo, field, entry) {
  if (fieldInfo === true) {
    // If info is true, source field is the same as output field
    return {sourceFields: [field]}
  } else if (typeof fieldInfo === 'string') {
    // If info is string, source field is that string
    return {sourceFields: [fieldInfo]}
  } else if (Array.isArray(fieldInfo) && typeof fieldInfo[0] === 'string') {
    // If info is a list of strings, source fields are those strings
    return {sourceFields: fieldInfo}
  } else if (Array.isArray(fieldInfo) && typeof fieldInfo[0] === 'object') {
    // If info is a list of objects, source fields depend on the entry type
    let specificInfo
    let genericInfo
    fieldInfo.forEach(infoPart => {
      if ((typeof infoPart.type === 'string' && infoPart.type === entry.type) ||
          (Array.isArray(infoPart.type) && infoPart.type.includes(entry.type))) {
        specificInfo = infoPart
      } else if (infoPart.type === '__default') {
        genericInfo = infoPart
      }
    })
    const combinedInfo = specificInfo || genericInfo
    if (!combinedInfo) {
      return {}
    }
    return parseFieldInfo(combinedInfo.convert ? combinedInfo : combinedInfo.fieldName, field, entry)
  } else if (typeof fieldInfo === 'object' && fieldInfo !== null) {
    // If info is a regular object, prepare the converter
    return {
      sourceFields: [].concat(fieldInfo.fieldName),
      workOnEmptyInput: fieldInfo.fieldName === undefined,
      convert: fieldInfo.convert,
      keepAll: fieldInfo.keepAll === true
    }
  } else {
    return {}
  }
}

const json = function (entry) {
  const target = {}

  for (const field in fieldMap) {
    let {
      sourceFields = [],
      workOnEmptyInput = false,
      convert = false,
      keepAll = false
    } = parseFieldInfo(fieldMap[field], field, entry)

    if (!keepAll) {
      sourceFields = sourceFields.filter(entry.hasOwnProperty.bind(entry))
    }

    if (!workOnEmptyInput && sourceFields.length === 0) {
      continue
    }

    let value = sourceFields.map(sourceField => entry[sourceField])

    if (typeof convert === 'function') {
      value = convert.call(entry, ...value)
      if (value !== undefined) {
        target[field] = value
      }
    } else {
      target[field] = value[0]
    }
  }

  return target
}

const getRisLine = (prop, value = '') => `${prop}  - ${value}\n`

const getRisField = ([prop, value]) => {
  if (Array.isArray(value)) {
    return value.map(valuePart => getRisLine(prop, valuePart)).join('')
  } else {
    return getRisLine(prop, value)
  }
}

const getRisPropList = function (entry) {
  const props = Object.entries(entry)

  // move type (TY) tag to start
  if (props[0][0] !== 'TY') {
    const typeTagIndex = props.findIndex(([prop]) => prop === 'TY')
    const [typeTag] = props.splice(typeTagIndex, 1)
    props.unshift(typeTag)
  }

  // add end (ER) tag
  props.push(['ER'])

  // serialize internal RIS JSON representation
  return props.map(getRisField).join('')
}

const getRis = function (entries) {
  // serialize and wrap entries
  return entries.map(json).map(getRisPropList).join('')
}

export default {
  ris (data, {type, format = type || 'text'} = {}) {
    if (format === 'object') {
      return data.map(json)
    } else {
      return getRis(data)
    }
  }
}
