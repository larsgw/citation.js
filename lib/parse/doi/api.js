'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch DOI API results
 *
 * @access private
 * @method fetchDoiApi
 *
 * @param {String} url - The input url
 *
 * @return {CSL} The fetched JSON
 */
var fetchDoiApi = function fetchDoiApi(url) {
  try {
    return JSON.parse((0, _syncRequest2.default)('GET', url, {
      headers: {
        Accept: 'application/vnd.citationstyles.csl+json'
      },
      allowRedirectHeaders: ['Accept']
    }).getBody('utf8'));
  } catch (e) {
    console.error('[set]', 'File \'' + url + '\' could not be fetched:', e.message);
    return {};
  }
};

/**
 * Get CSL JSON from DOI API URLs.
 *
 * @access protected
 * @method parseDoiApi
 *
 * @param {String|Array<String>} data - DOIs
 *
 * @return {Array<CSL>} Array of CSL
 */
var parseDoiApi = function parseDoiApi(data) {
  return [].concat(data).map(fetchDoiApi).map(_json2.default);
};

exports.default = parseDoiApi;