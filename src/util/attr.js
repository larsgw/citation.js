/**
 * Add data-* attribute to a HTML string
 * 
 * @access private
 * @method getAttributedEntry
 * 
 * @param {String} string - HTML string
 * @param {String} name - attribute name
 * @param {String} value - attribute value
 * 
 * @return {String} HTML string with attribute
 */
var getAttributedEntry = function ( string, name, value ) {
  return string.replace( /^\s*<[a-z]+/, function ( match ) {
    return `${match} data-${name}="${value}"`
  } )
}

/**
 * Add CSL identifiers to entry
 * 
 * @access private
 * @method getPrefixedEntry
 * 
 * @param {String} value - HTML string
 * @param {Number} index - ID index
 * @param {String[]} list - ID list
 * 
 * @return {String} HTML string with CSL ID
 */
var getPrefixedEntry = function ( value, index, list ) {
  var id = list[ index ]
  return getAttributedEntry( value, 'csl-entry-id', id )
}

export { getAttributedEntry, getPrefixedEntry }