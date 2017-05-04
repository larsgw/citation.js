/**
 * Convert epoch to CSL date
 * 
 * @access private
 * @function parseDate
 * 
 * @param {Number|String} value - Epoch time or string in format "YYYY-MM-DD"
 * 
 * @return {Object[]} Array of an object, containing the property "date-parts" with the value [ YYYY, MM, DD ]
 */
var parseDate = function ( value ) {
  var rValue
    , date = new Date( value )
  
  rValue = [
    date.getFullYear()
  , date.getMonth   () + 1
  , date.getDate    ()
  ]
  
  return [ { 'date-parts': rValue } ]
}

export default parseDate