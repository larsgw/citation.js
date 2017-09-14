import fetchBibTeXType from './type'
import getBibTeXLabel from './label'
import getName from '../name'
import getDate from '../date'

/**
 * Get BibTeX-JSON from CSL(-JSON)
 *
 * @access protected
 * @method getBibTeXJSON
 *
 * @param {CSL} src - Input CSL
 *
 * @return {Object} Output BibTeX-JSON
 */
const getBibTeXJSON = function (src) {
  const res = {
    label: getBibTeXLabel(src),
    type: fetchBibTeXType(src.type)
  }

  const props = {}

  const simple = {
    'collection-title': 'series',
    'container-title': src.type === 'chapter' ? 'booktitle' : 'journal',
    edition: 'edition',
    event: 'organization',
    DOI: 'doi',
    ISBN: 'isbn',
    ISSN: 'issn',
    issue: 'number',
    language: 'language',
    note: 'note',
    'number-of-pages': 'numpages',
    PMID: 'pmid',
    PMCID: 'pmcid',
    publisher: 'publisher',
    'publisher-place': 'address',
    title: 'title',
    url: 'url',
    volume: 'volume'
  }

  for (let prop in simple) {
    if (src.hasOwnProperty(prop)) {
      props[simple[prop]] = src[prop] + ''
    }
  }

  if (src.author) {
    props.author = src.author.map(name => getName(name, true)).join(' and ')
  }
  if (src.editor) {
    props.editor = src.editor.map(name => getName(name, true)).join(' and ')
  }

  if (!src.note && src.accessed) {
    props.note = `[Online; accessed ${getDate(src.accessed)}]`
  }

  if (src.page) {
    props.pages = src.page.replace('-', '--')
  }

  if (src.issued && src.issued['date-parts'][0].length === 3) {
    props.date = getDate(src.issued)
    props.year = src.issued['date-parts'][0][0].toString()
    props.month = src.issued['date-parts'][0][1].toString()
    props.day = src.issued['date-parts'][0][2].toString()
  }

  res.properties = props

  return res
}

export default getBibTeXJSON
