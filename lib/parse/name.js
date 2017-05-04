'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regex = require('./regex');

var _regex2 = _interopRequireDefault(_regex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get CSL from name
 * 
 * @access private
 * @method parseName
 * 
 * @param {String} str - string 
 * 
 * @return {Object} The CSL object
 */
var parseName = function parseName(str) {

  if (str.indexOf(', ') > -1) var arr = str.split(', ').reverse();else var arr = str.split(_regex2.default.name);

  var obj = {
    given: arr[0],
    family: arr[1]
  };

  return obj;
};

exports.default = parseName;