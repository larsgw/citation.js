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
const getAttributedEntry = (string, name, value) => string.replace(/^\s*<[a-z]+/i, match => `${match} data-${name}="${value}"`)

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

/**
 * Get a rendered affix
 *
 * @access private
 * @method getAffix
 *
 * @param {CSL} source - source element
 * @param {String|Cite~wrapper} affix
 *
 * @return {String} Rendered affixs
 */
const getAffix = (source, affix) => typeof affix === 'function' ? affix(source) : typeof affix === 'string' ? affix : ''

/**
 * Pre/append things to entry
 *
 * @access protected
 * @method getWrappedEntry
 *
 * @param {String} value - HTML string
 * @param {CSL} source - source element
 * @param {Object} wrapping - append / prepend configuration
 * @param {String|Cite~wrapper} [wrapping.prepend]
 * @param {String|Cite~wrapper} [wrapping.append]
 *
 * @return {String} Wrapped HTML string
 */
const getWrappedEntry = (value, source, {prepend, append}) => {
  const [, a, c, e] = value.match(/^(\s*<[a-z0-9:-]+(?:\s*[a-z0-9:-]+=(?:"(?:\\\\|\\"|[^"])*"|'(?:\\\\|\\'|[^'])*'|\w+))*\s*>)([\s\S]+)(<\/[a-z:]+>\s*)$/i) || []
  const b = getAffix(source, prepend)
  const d = getAffix(source, append)
  return a + b + c + d + e
}

export { getAttributedEntry, getPrefixedEntry, getWrappedEntry }
