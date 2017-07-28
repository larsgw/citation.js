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

  const dateFields = ['submitted', 'issued', 'event-date', 'original-date', 'container', 'accessed']
  dateFields.forEach(field => {
    if (data[field] && typeof data[field]['date-parts'][0] === 'number') {
      data[field]['date-parts'] = [data[field]['date-parts']]
    }
  })

  return Object.assign({}, data, res)
}

export default parseDoiJson
