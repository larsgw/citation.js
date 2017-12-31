'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Register = exports.TokenStack = exports.fetchId = exports.fetchFileAsync = exports.fetchFile = exports.deepCopy = exports.attr = undefined;

var _deepCopy = require('./deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _fetchFile = require('./fetchFile');

var _fetchFile2 = _interopRequireDefault(_fetchFile);

var _fetchFileAsync = require('./fetchFileAsync');

var _fetchFileAsync2 = _interopRequireDefault(_fetchFileAsync);

var _fetchId = require('./fetchId');

var _fetchId2 = _interopRequireDefault(_fetchId);

var _stack = require('./stack');

var _stack2 = _interopRequireDefault(_stack);

var _register = require('./register');

var _register2 = _interopRequireDefault(_register);

var _attr = require('../get/modules/csl/attr');

var _affix = require('../get/modules/csl/affix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attr = { getAttributedEntry: _attr.getAttributedEntry, getPrefixedEntry: _attr.getPrefixedEntry, getWrappedEntry: _affix.getWrappedEntry };
exports.attr = attr;
exports.deepCopy = _deepCopy2.default;
exports.fetchFile = _fetchFile2.default;
exports.fetchFileAsync = _fetchFileAsync2.default;
exports.fetchId = _fetchId2.default;
exports.TokenStack = _stack2.default;
exports.Register = _register2.default;