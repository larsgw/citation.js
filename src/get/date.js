/**
 * Convert a CSL date into human-readable format
 *
 * @access protected
 * @memberof Cite.get
 *
 * @param {Object} date - A date in CSL format
 * @param {String} [delimiter='-'] - Date part delimiter
 *
 * @return {String} The string
 */
const getDate = function ({'date-parts': [date]}, delimiter = '-') {
  if (date.length !== 3) {
    return ''
  }
  const [year, month, day] = date.map(part => part.toString())

  return [year.padStart(4, '0'), month.padStart(2, '0'), day.padStart(2, '0')].join(delimiter)
}

export default getDate
