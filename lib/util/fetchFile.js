'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch file
 *
 * @access protected
 * @method fetchFile
 *
 * @param {String} url - The input url
 *
 * @return {String} The fetched string
 */
var fetchFile = function fetchFile(url) {
  try {
    return (0, _syncRequest2.default)('GET', url).getBody('utf8');
  } catch (e) {
    console.error('[set]', 'File \'' + url + '\' could not be fetched:', e.message);
    return '[]';
  }
};

exports.default = fetchFile;