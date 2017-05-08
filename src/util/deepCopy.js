/**
 * Duplicate objects to prevent Cite changing values outside of own scope
 *
 * @access protected
 * @method deepCopy
 *
 * @param {Object} obj - Input object
 *
 * @return {Object} Duplicated object
 */
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj))

export default deepCopy
