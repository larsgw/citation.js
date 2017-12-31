/**
 * @module output/csl
 */

/**
 * Get a rendered affix
 *
 * @access private
 *
 * @param {CSL} source - source element
 * @param {String|Cite~wrapper} affix
 *
 * @return {String} Rendered affixs
 */
const getAffix = (source, affix) => typeof affix === 'function' ? affix(source) : typeof affix === 'string' ? affix : ''

const htmlRegex = /^(\s*<[a-z0-9:-]+(?:\s*[a-z0-9:-]+=(?:"(?:\\\\|\\"|[^"])*"|'(?:\\\\|\\'|[^'])*'|\w+))*\s*>)([\s\S]+)(<\/[a-z:]+>\s*)$/i

/**
 * Pre/append things to entry
 *
 * @access protected
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
  const [, start = '', content = value, end = ''] = value.match(htmlRegex) || []
  const prefix = getAffix(source, prepend)
  const suffix = getAffix(source, append)
  return start + prefix + content + suffix + end
}

export {getWrappedEntry}
