/**
 * @module output/bibtex
 */

/**
 * Get a BibTeX label from CSL data
 *
 * @access protected
 * @method getBibTeXLabel
 *
 * @param {CSL} src - Input CSL
 *
 * @return {String} The label
 */
const getBibTeXLabel = function (entry = {}) {
  if (entry['citation-label']) {
    return entry['citation-label']
  }

  let res = ''

  if (entry.author) {
    res += entry.author[0].family || entry.author[0].literal
  }
  if (entry.issued && entry.issued['date-parts'] && entry.issued['date-parts'][0]) {
    res += entry.issued['date-parts'][0][0]
  }
  if (entry['year-suffix']) {
    res += entry['year-suffix']
  } else if (entry.title) {
    res += entry.title.replace(/<\/?.*?>/g, '').match(/^(?:(?:the|a|an)\s+)?(\S+)/i)[1]
  }

  return res
}

export default getBibTeXLabel
