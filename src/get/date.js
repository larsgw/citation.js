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
  let strings = date.map(part => part.toString())

  switch (strings.length) {
    // Day
    case 3:
      strings[2] = strings[2].padStart(2, '0')
      // fall through

    // Month
    case 2:
      strings[1] = strings[1].padStart(2, '0')
      // fall through

    // Year
    case 1:
      strings[0] = strings[0].padStart(4, '0')
      break
  }

  return strings.join(delimiter)
}

export default getDate
