/**
 * Convert a CSL date into human-readable format
 *
 * @access protected
 * @memberof Cite.get
 *
 * @param {Object} date - A date in CSL format
 *
 * @return {String} The string
 */
const getDate = function ({'date-parts': [date]}) {
  if (date.length === 3) {
    const [year, month, day] = date.map(part => part.toString())
    return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  } else {
    return ''
  }
}

export default getDate
