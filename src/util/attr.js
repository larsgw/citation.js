/**
 * Add data-* attribute to a HTML string
 *
 * @access protected
 * @method getAttributedEntry
 *
 * @param {String} string - HTML string
 * @param {String} name - attribute name
 * @param {String} value - attribute value
 *
 * @return {String} HTML string with attribute
 */
const getAttributedEntry = (string, name, value) => string.replace(/^\s*<[a-z]+/, match => `${match} data-${name}="${value}"`)

/**
 * Add CSL identifiers to entry
 *
 * @access protected
 * @method getPrefixedEntry
 *
 * @param {String} value - HTML string
 * @param {Number} index - ID index
 * @param {String[]} list - ID list
 *
 * @return {String} HTML string with CSL ID
 */
var getPrefixedEntry = (value, index, list) => getAttributedEntry(value, 'csl-entry-id', list[index])

export { getAttributedEntry, getPrefixedEntry }
