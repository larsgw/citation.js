const startParts = ['dropping-particle', 'given']
const suffixParts = ['suffix']
const endParts = ['non-dropping-particle', 'family']

/**
 * Get name from CSL
 *
 * @access protected
 * @memberof Cite.get
 *
 * @param {Object} name - CSL input
 * @param {Boolean} [reversed=false] - output name as 'family, given'
 *
 * @return {String} Full name
 */
const getName = function (name, reversed = false) {
  const get = parts => parts.map(entry => name[entry] || '').filter(Boolean).join(' ')

  if (name.literal) {
    return name.literal
  } else if (reversed) {
    const suffixPart = get(suffixParts) ? `, ${get(suffixParts)}` : ''
    const startPart = get(startParts) ? `, ${get(startParts)}` : ''
    return get(endParts) + suffixPart + startPart
  } else {
    return `${get([...startParts, ...suffixParts, ...endParts])}`
  }
}

export default getName
