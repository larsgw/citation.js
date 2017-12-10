"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fetchId = function fetchId(list, prefix) {
  var id = void 0;

  while (list.includes(id)) {
    id = "" + prefix + Math.random().toString().slice(2);
  }

  return id;
};

exports.default = fetchId;