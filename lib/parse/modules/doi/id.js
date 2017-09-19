'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Get DOI API URLs from DOI ID.
 *
 * @access protected
 * @method parseDoi
 *
 * @param {String} data - DOIs
 *
 * @return {Array<String>} DOI URLs
 */
var parseDoi = function parseDoi(data) {
  var list = Array.isArray(data) ? data : data.split(/(?:\s+)/g);
  return list.map(function (doi) {
    return 'https://doi.org/' + doi.trim();
  });
};

var scope = exports.scope = '@doi';
var types = exports.types = ['@doi/id', '@doi/list+text', '@doi/list+object'];
exports.parse = parseDoi;
exports.default = parseDoi;