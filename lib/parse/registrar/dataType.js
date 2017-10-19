'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var typeOf = function typeOf(thing) {
  return thing === undefined ? 'Undefined' : thing === null ? 'Null' : thing.constructor.name;
};
var dataTypeOf = function dataTypeOf(thing) {
  switch (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) {
    case 'string':
      return 'String';

    case 'object':
      if (Array.isArray(thing)) {
        return 'Array';
      } else if (typeOf(thing) === 'Object') {
        return 'SimpleObject';
      } else if (typeOf(thing) !== 'Null') {
        return 'ComplexObject';
      }
    // fall through when thing === null, return default value

    default:
      return 'Primitive';
  }
};

exports.typeOf = typeOf;
exports.dataTypeOf = dataTypeOf;