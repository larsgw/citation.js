'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regex = require('./regex');

var _regex2 = _interopRequireDefault(_regex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parse (in)valid JSON
 * 
 * @access private
 * @method parseJSON
 * 
 * @param {String} str - The input string
 * 
 * @return {Object|Object[]|String[]} The parsed object
 */
var parseJSON = function parseJSON(str) {
  var object;
  try {
    object = JSON.parse(str);
  } catch (e) {
    console.info('[set]', 'Input was not valid JSON, switching to experimental parser for invalid JSON');
    try {
      object = JSON.parse(str.replace(_regex2.default.json[0][0], _regex2.default.json[0][1]).replace(_regex2.default.json[1][0], _regex2.default.json[1][1]));
    } catch (e) {
      console.error('[set]', 'Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.');
    }
  }
  return object;
};

exports.default = parseJSON;