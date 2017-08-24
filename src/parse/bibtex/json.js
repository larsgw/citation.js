import parseBibTeXProp from './prop'
import parseBibTeXType from './type'

/**
 * Format BibTeX JSON data
 *
 * @access protected
 * @method parseBibTeXJSON
 *
 * @param {Object|Array<Object>} data - The input data
 *
 * @return {Array<CSL>} The formatted input data
 */
const parseBibTeXJSON = function (data) {
  return [].concat(data).map(entry => {
    const newEntry = {}
    let toMerge = []

    for (let prop in entry.properties) {
      const oldValue = entry.properties[prop]
      const [cslField, cslValue] = parseBibTeXProp(prop, oldValue) || []

      if (cslField) {
        if (/^[^:\s]+?:[^.\s]+(\.[^.\s]+)*$/.test(cslField)) {
          toMerge.push([cslField, cslValue])
        } else {
          newEntry[cslField] = cslValue
        }
      }
    }

    newEntry.type = parseBibTeXType(entry.type)
    newEntry.id = newEntry._label = entry.label

    toMerge.forEach(([cslField, value]) => {
      const props = cslField.split(/:|\./g)
      let cursor = newEntry

      while (props.length > 0) {
        const prop = props.shift()
        cursor = cursor[prop] || (cursor[prop] = !props.length ? value : isNaN(+props[0]) ? {} : [])
      }
    })

    return newEntry
  })
}

export default parseBibTeXJSON
