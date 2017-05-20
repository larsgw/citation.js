import parseBibTeXProp from './prop'
import parseBibTeXType from './type'

/**
 * Format BibTeX JSON data
 *
 * @access protected
 * @method parseBibTeXJSON
 *
 * @param {Object[]} data - The input data
 *
 * @return {CSL[]} The formatted input data
 */
const parseBibTeXJSON = function (data) {
  return data.map(entry => {
    const newEntry = {}

    for (var prop in entry.properties) {
      const oldValue = entry.properties[prop]
      const newValue = parseBibTeXProp(prop, oldValue)

      if (newValue) {
        newEntry[newValue[0]] = newValue[1]
      }
    }

    newEntry.type = parseBibTeXType(entry.type)
    newEntry.id = newEntry.label = entry.label

    return newEntry
  })
}

export default parseBibTeXJSON
