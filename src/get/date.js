/**
 * Convert a CSL date into human-readable format
 *
 * @access protected
 * @function getDate
 *
 * @param {Object} date - A date in CSL format
 *
 * @return {String} The string
 */
const getDate = function ({'date-parts': [date]}) {
  if (date.length === 3) {
    return `${date[0].padStart(4, '0')}-${date[1].padStart(2, '0')}-${date[2].padStart(2, '0')}`
  } else {
    return ''
  }
}

export default getDate
