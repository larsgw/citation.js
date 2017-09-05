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
  const startParts = ['dropping-particle', 'given', 'suffix']
  const endParts = ['non-dropping-particle', 'family']
  const get = parts => parts.map(entry => name[entry] || '').filter(Boolean).join(' ')

  if (name.literal) {
    return name.literal
  } else if (reversed) {
    return `${get(endParts)}, ${get(startParts)}`
  } else {
    return `${get(startParts.concat(endParts))}`
  }
}

export default getName
