import fetchDoiType from './type'

/**
 * Format CrossRef JSON
 *
 * @access protected
 * @method parseDoiJson
 *
 * @param {Object} data - The input data
 *
 * @return {CSL} The formatted input data
 */
const parseDoiJson = function (data) {
  const res = {
    type: fetchDoiType(data.type)
  }

  // TODO because of conflicting implementation of citeproc-js; this is actually *not* CrossRefs 'fault'
  const dateFields = ['submitted', 'issued', 'event-date', 'original-date', 'container', 'accessed']
  dateFields.forEach(field => {
    if (data[field]) {
      const dateParts = data[field]['date-parts']
      if (dateParts) {
        res[field] = [{
          'date-parts': typeof dateParts[0] === 'number' ? dateParts : dateParts[0]
        }]
      }
    }
  })

  return Object.assign({}, data, res)
}

export default parseDoiJson
