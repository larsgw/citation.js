/**
 * Get name from CSL
 *
 * @access protected
 * @method getName
 *
 * @param {Object} name - CSL input
 * @param {Boolean} [reversed=false] - ouput name as 'family, given'
 *
 * @return {String} Full name
 */
const getName = function (name, reversed = false) {
  const startParts = ['dropping-particle', 'given']
  const suffixParts = ['suffix']
  const endParts = ['non-dropping-particle', 'family']
  const get = parts => parts.map(entry => name[entry] || '').filter(Boolean).join(' ')

  if (name.literal) {
    return name.literal
  } else if (reversed) {
    const suffixPart = get(suffixParts) ? `, ${get(suffixParts)}` : ''
    const startPart = get(startParts) ? `, ${get(startParts)}` : ''
    return get(endParts) + suffixPart + startPart
  } else {
    return `${get(startParts.concat(suffixParts, endParts))}`
  }
}

export default getName
