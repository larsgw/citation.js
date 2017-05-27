/**
 * Convert epoch to CSL date
 *
 * @access protected
 * @function parseDate
 *
 * @param {Number|String} value - Epoch time or string in format "YYYY-MM-DD"
 *
 * @return {Object[]} Array of an object, containing the property "date-parts" with the value [ YYYY, MM, DD ]
 */
const parseDate = function (value) {
  const date = new Date(value)
  return [{
    'date-parts': date.getFullYear() ? [date.getFullYear(), date.getMonth() + 1, date.getDate()] : []
  }]
}

export default parseDate
