import parseDate from '../date'
import parseName from '../name'

/**
 * Forat ContentMine data
 *
 * @access protected
 * @method parseContentMine
 *
 * @param {Object} data - The input data
 *
 * @return {Array<CSL>} The formatted input data
 */
const parseContentMine = function (data) {
  const res = {
    type: 'article-journal'
  }

  Object.keys(data).forEach((prop) => { res[prop] = data[prop].value[0] })

  if (res.hasOwnProperty('authors')) { res.author = data.authors.value.map(parseName) }
  if (res.hasOwnProperty('firstpage')) {
    res.page = res['page-first'] = res.firstpage
  }
  if (res.hasOwnProperty('date')) { res.issued = parseDate(res.date) }
  if (res.hasOwnProperty('journal')) { res['container-title'] = res.journal }
  if (res.hasOwnProperty('doi')) { res.id = res.DOI = res.doi }

  return res
}

export default parseContentMine
