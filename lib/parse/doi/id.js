"use strict";

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
  return data.split(/(?:\s+)/g).map(function (doi) {
    return "https://doi.org/" + doi.trim();
  });
};

exports.default = parseDoi;