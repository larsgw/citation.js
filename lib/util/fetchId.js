"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var fetchId = function fetchId(list, prefix) {
  var id;

  while (list.includes(id)) {
    id = "".concat(prefix).concat(Math.random().toString().slice(2));
  }

  return id;
};

var _default = fetchId;
exports.default = _default;