"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataTypeOf = exports.typeOf = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var typeOf = function typeOf(thing) {
  switch (thing) {
    case undefined:
      return 'Undefined';

    case null:
      return 'Null';

    default:
      return thing.constructor.name;
  }
};

exports.typeOf = typeOf;

var dataTypeOf = function dataTypeOf(thing) {
  switch (_typeof(thing)) {
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

    default:
      return 'Primitive';
  }
};

exports.dataTypeOf = dataTypeOf;