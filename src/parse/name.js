import varRegex from './regex'

/**
 * Get CSL from name
 *
 * @access protected
 * @method parseName
 *
 * @param {String} name - string
 *
 * @return {Object} The CSL object
 */
const parseName = function (name = '') {
  if (typeof name !== 'string') {
    name = name + ''
  }

  const [given, family] = name.includes(', ') ? name.split(', ').reverse() : name.split(varRegex.name)

  return family ? {given, family} : {literal: given}
}

export default parseName
