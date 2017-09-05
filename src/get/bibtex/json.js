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

  if (src.author) { props.author = src.author.map(name => getName(name, true)).join(' and ') }
  if (src.event) { props.organization = src.event }
  if (src.accessed) { props.note = '[Online; accesed ' + getDate(src.accessed) + ']' }
  if (src.DOI) { props.doi = src.DOI }
  if (src.editor) { props.editor = src.editor.map(name => getName(name, true)).join(' and ') }
  if (src.ISBN) { props.isbn = src.ISBN }
  if (src.ISSN) { props.issn = src.ISSN }
  if (src['container-title']) { props.journal = src['container-title'] }
  if (src.issue || src.issue === 0) { props.issue = src.issue.toString() }
  if (src.page) { props.pages = src.page.replace('-', '--') }
  if (src['publisher-place']) { props.address = src['publisher-place'] }
  if (src.edition || src.edition === 0) { props.edition = src.edition.toString() }
  if (src.publisher) { props.publisher = src.publisher }
  if (src.title) { props.title = src['title'] }
  if (src.url) { props.url = src.url }
  if (src.volume || src.volume === 0) { props.volume = src.volume.toString() }
  if (src.issued && src.issued['date-parts'][0].length === 3) {
    props.year = src.issued['date-parts'][0][0].toString()
  }

  res.properties = props

  return res
}

export default getBibTeXJSON
