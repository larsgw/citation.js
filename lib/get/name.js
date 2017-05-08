'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Get name from CSL
 *
 * @access protected
 * @method getName
 *
 * @param {Object} obj - CSL input
 *
 * @return {String} Full name
 */
var getName = function getName(obj) {
  var arr = ['dropping-particle', 'given', 'suffix', 'non-dropping-particle', 'family'];
  return obj.literal || arr.map(function (entry) {
    return obj[entry] || '';
  }).filter(function (v) {
    return !!v;
  }).join(' ');
};

exports.default = getName;