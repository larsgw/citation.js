"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var deepCopy = function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
};

exports.default = deepCopy;