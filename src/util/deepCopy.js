/**
 * Duplicate objects to prevent Cite changing values outside of own scope
 * 
 * @access private
 * @method deepCopy
 * 
 * @param {Object} obj - Input object
 * 
 * @return {Object} Duplicated object
 */
var deepCopy = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default deepCopy