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
const parseName = function (name) {
  const [given, family] = name.includes(', ') ? name.split(', ').reverse() : name.split(varRegex.name)

  return {
    given,
    family
  }
}

export default parseName
