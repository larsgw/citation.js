"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "deepCopy", {
  enumerable: true,
  get: function get() {
    return _deepCopy.default;
  }
});
Object.defineProperty(exports, "fetchFile", {
  enumerable: true,
  get: function get() {
    return _fetchFile.default;
  }
});
Object.defineProperty(exports, "fetchFileAsync", {
  enumerable: true,
  get: function get() {
    return _fetchFileAsync.default;
  }
});
Object.defineProperty(exports, "fetchId", {
  enumerable: true,
  get: function get() {
    return _fetchId.default;
  }
});
Object.defineProperty(exports, "TokenStack", {
  enumerable: true,
  get: function get() {
    return _stack.default;
  }
});
Object.defineProperty(exports, "Register", {
  enumerable: true,
  get: function get() {
    return _register.default;
  }
});
exports.attr = void 0;

var _deepCopy = _interopRequireDefault(require("./deepCopy"));

var _fetchFile = _interopRequireDefault(require("./fetchFile"));

var _fetchFileAsync = _interopRequireDefault(require("./fetchFileAsync"));

var _fetchId = _interopRequireDefault(require("./fetchId"));

var _stack = _interopRequireDefault(require("./stack"));

var _register = _interopRequireDefault(require("./register"));

var _attr = require("../get/modules/csl/attr");

var _affix = require("../get/modules/csl/affix");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attr = {
  getAttributedEntry: _attr.getAttributedEntry,
  getPrefixedEntry: _attr.getPrefixedEntry,
  getWrappedEntry: _affix.getWrappedEntry
};
exports.attr = attr;