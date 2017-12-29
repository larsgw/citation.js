'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var startParts = ['dropping-particle', 'given'];
var suffixParts = ['suffix'];
var endParts = ['non-dropping-particle', 'family'];

var getName = function getName(name) {
  var reversed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var get = function get(parts) {
    return parts.map(function (entry) {
      return name[entry] || '';
    }).filter(Boolean).join(' ');
  };

  if (name.literal) {
    return name.literal;
  } else if (reversed) {
    var suffixPart = get(suffixParts) ? ', ' + get(suffixParts) : '';
    var startPart = get(startParts) ? ', ' + get(startParts) : '';
    return get(endParts) + suffixPart + startPart;
  } else {
    return '' + get([].concat(startParts, suffixParts, endParts));
  }
};

exports.default = getName;