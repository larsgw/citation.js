"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fetchCSLItemCallback = function fetchCSLItemCallback(data) {
  return function (id) {
    return data.find(function (entry) {
      return entry.id === id;
    });
  };
};

exports.default = fetchCSLItemCallback;