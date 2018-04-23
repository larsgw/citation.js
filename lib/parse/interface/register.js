"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = void 0;

var _parser = require("./parser");

var add = function add(format, parsers) {
  var formatParser = new _parser.FormatParser(format, parsers);
  formatParser.validate();
  formatParser.add();
};

exports.add = add;