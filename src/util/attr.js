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
 * @param {String|Number} id - ID
 *
 * @return {String} HTML string with CSL ID
 */
const getPrefixedEntry = (value, id) => getAttributedEntry(value, 'csl-entry-id', id)

export { getAttributedEntry, getPrefixedEntry }
