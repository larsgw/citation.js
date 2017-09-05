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
 * @param {Object} name - CSL input
 * @param {Boolean} [reversed=false] - ouput name as 'family, given'
 *
 * @return {String} Full name
 */
var getName = function getName(name) {
  var reversed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var startParts = ['dropping-particle', 'given', 'suffix'];
  var endParts = ['non-dropping-particle', 'family'];
  var get = function get(parts) {
    return parts.map(function (entry) {
      return name[entry] || '';
    }).filter(Boolean).join(' ');
  };

  if (name.literal) {
    return name.literal;
  } else if (reversed) {
    return get(endParts) + ', ' + get(startParts);
  } else {
    return '' + get(startParts.concat(endParts));
  }
};

exports.default = getName;