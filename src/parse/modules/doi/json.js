/**
 * @module input/doi
 */

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
    let value = data[field]
    if (value && value['date-parts'] && typeof value['date-parts'][0] === 'number') {
      value['date-parts'] = [value['date-parts']]
    }
  })

  return Object.assign({}, data, res)
}

export {
  parseDoiJson as parse,
  parseDoiJson as default
}
