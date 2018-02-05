"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var deepCopy = function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
};

var _default = deepCopy;
exports.default = _default;