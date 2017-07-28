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
const getBibTeXLabel = function ({author, issued, title} = {}) {
  let res = ''

  if (author) {
    res += author[0].family || author[0].literal
  }
  if (issued && issued['date-parts'][0]) {
    res += issued['date-parts'][0][0]
  }
  if (title) {
    res += title.match(/^(?:(?:the|a|an)\s+)?(\S+)/i)[1]
  }

  return res
}

export default getBibTeXLabel
