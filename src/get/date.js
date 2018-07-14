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
  let dateParts = date.map(part => part.toString())

  switch (dateParts.length) {
    case 3:
      // Day
      dateParts[2] = dateParts[2].padStart(2, '0')
      // fall through
    case 2:
      // Month
      dateParts[1] = dateParts[1].padStart(2, '0')
      // fall through
    case 1:
      // Year
      dateParts[0] = dateParts[0].padStart(4, '0')
      break
  }

  return dateParts.join(delimiter)
}

export default getDate
