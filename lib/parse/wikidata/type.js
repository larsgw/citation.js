'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Object containing a list of Wikidata Instances and it's corresponding name as specified by the docs
 *
 * @access private
 * @constant varWikidataTypes
 * @default
 */
var varWikidataTypes = {
  Q13442814: 'article-journal',
  Q18918145: 'article-journal',
  Q191067: 'article',
  Q3331189: 'book',
  Q571: 'book'

  /**
   * Get CSL type from Wikidata type (P31)
   *
   * @access protected
   * @method fetchWikidataType
   *
   * @param {String} value - Input P31 Wikidata ID
   *
   * @return {String} Output CSL type
   */
};var fetchWikidataType = function fetchWikidataType(value) {
  return varWikidataTypes[value];
};

exports.default = fetchWikidataType;