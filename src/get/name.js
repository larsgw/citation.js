/**
 * Get name from CSL
 *
 * @access protected
 * @method getName
 *
 * @param {Object} obj - CSL input
 *
 * @return {String} Full name
 */
const getName = function (obj) {
  const arr = ['dropping-particle', 'given', 'suffix', 'non-dropping-particle', 'family']
  return obj.literal || arr.map((entry) => obj[entry] || '').filter(v => !!v).join(' ')
}

export default getName
