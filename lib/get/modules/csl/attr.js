"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrefixedEntry = exports.getAttributedEntry = void 0;

var getAttributedEntry = function getAttributedEntry(string, name, value) {
  return string.replace(/^\s*<[a-z]+/i, "$& data-".concat(name, "=\"").concat(value, "\""));
};

exports.getAttributedEntry = getAttributedEntry;

var getPrefixedEntry = function getPrefixedEntry(value, id) {
  return getAttributedEntry(value, 'csl-entry-id', id);
};

exports.getPrefixedEntry = getPrefixedEntry;