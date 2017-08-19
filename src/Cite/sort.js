import getLabel from '../get/label'
import getName from '../get/name'

/**
 * Get value for comparing
 *
 * @access private
 * @method getComparisonValue
 *
 * @param {CSL} obj - obj
 * @param {String} prop - The prop in question
 * @param {Boolean} label - Prop is label
 *
 * @return {String|Number} something to compare
 */
const getComparisonValue = function (obj, prop, label = prop === 'label') {
  let value = label ? getLabel(obj) : obj[prop]

  switch (prop) {
    case 'author':
    case 'editor':
      return value.map(name => name.literal || name.family || getName(name))

    case 'accessed':
    case 'issued':
      return value['date-parts'][0]

    case 'page':
      return value.split('-').map(num => parseInt(num))

    case 'edition':
    case 'issue':
    case 'volume':
      value = parseInt(value)
      return !isNaN(value) ? value : -Infinity

    default:
      return value || -Infinity
  }
}

/**
 * Compares props
 *
 * @access private
 * @method compareProp
 *
 * @param {CSL} a - Object a
 * @param {CSL} b - Object b
 * @param {String} prop - The prop in question. Prepend ! to sort the other way around.
 * @param {Boolean} flip - Override flip
 *
 * @return {Number} positive for a > b, negative for b > a, zero for a = b (flips if prop has !)
 */
const compareProp = function (a, b, prop, flip = /^!/.test(prop)) {
  prop = prop.replace(/^!/, '')
  const valueA = getComparisonValue(a, prop)
  const valueB = getComparisonValue(b, prop)

  return valueA === valueB ? 0 : flip !== (valueA > valueB) ? 1 : -1
}

/**
 * Generates a sorting callback based on props.
 *
 * @access private
 * @method getSortCallback
 *
 * @param {...String} props - How to sort
 *
 * @return {Cite~sort} sorting callback
 */
const getSortCallback = function (...props) {
  return (a, b) => {
    const keys = props.slice()
    let output = 0

    while (!output && keys.length) {
      output = compareProp(a, b, keys.shift())
    }

    return output
  }
}

/**
 * Sort the dataset
 *
 * @method sort
 * @memberof Cite
 * @this Cite
 *
 * @param {Cite~sort|Array<String>} [method=[]] - How to sort
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const sort = function (method = [], log) {
  if (log) {
    this.save()
  }

  this.data.sort(typeof method === 'function' ? method : getSortCallback(...method, 'label'))

  return this
}

export { sort }
