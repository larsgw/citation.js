/**
 * Get a BibTeX label from CSL data
 *
 * @access private
 * @method getBibTeXLabel
 *
 * @param {CSL} src - Input CSL
 *
 * @return {String} The label
 */
const getBibTeXLabel = function ({author = [], year, issued = [], title} = {}) {
  let res = ''

  if (author.length > 0) {
    res += author[0].family || author[0].literal
  }

  if (year) {
    res += year
  } else if (issued.length > 0 && issued[0]['date-parts']) {
    res += issued[0]['date-parts'][0]
  }

  if (title) {
    res += title.match(/^(?:(?:the|a|an)\s+)?(\S+)/i)[1]
  }

  return res
}

export default getBibTeXLabel
