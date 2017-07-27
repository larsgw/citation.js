'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Add data-* attribute to a HTML string
 *
 * @access protected
 * @method getAttributedEntry
 *
 * @param {String} string - HTML string
 * @param {String} name - attribute name
 * @param {String} value - attribute value
 *
 * @return {String} HTML string with attribute
 */
var getAttributedEntry = function getAttributedEntry(string, name, value) {
  return string.replace(/^\s*<[a-z]+/, function (match) {
    return match + ' data-' + name + '="' + value + '"';
  });
};

/**
 * Add CSL identifiers to entry
 *
 * @access protected
 * @method getPrefixedEntry
 *
 * @param {String} value - HTML string
 * @param {String|Number} id - ID
 *
 * @return {String} HTML string with CSL ID
 */
var getPrefixedEntry = function getPrefixedEntry(value, id) {
  return getAttributedEntry(value, 'csl-entry-id', id);
};

exports.getAttributedEntry = getAttributedEntry;
exports.getPrefixedEntry = getPrefixedEntry;