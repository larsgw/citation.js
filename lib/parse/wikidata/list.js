'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get Wikidata JSON from Wikidata IDs
 *
 * @access protected
 * @method parseWikidata
 *
 * @param {String} data - Wikidata IDs
 *
 * @return {Object} Wikidata JSON
 */
var parseWikidata = function parseWikidata(data) {
  return [].concat(_wikidataSdk2.default.getEntities(data.split(/(?:\s+|,\s*)/g), ['en']));
};

exports.default = parseWikidata;