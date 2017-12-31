'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var getAttributedEntry = function getAttributedEntry(string, name, value) {
  return string.replace(/^\s*<[a-z]+/i, '$& data-' + name + '="' + value + '"');
};

var getPrefixedEntry = function getPrefixedEntry(value, id) {
  return getAttributedEntry(value, 'csl-entry-id', id);
};

exports.getAttributedEntry = getAttributedEntry;
exports.getPrefixedEntry = getPrefixedEntry;