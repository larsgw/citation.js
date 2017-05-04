'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.citeproc = exports.cite = undefined;

var _package = require('../package.json');

var _citeproc = require('citeproc');

var _citeproc2 = _interopRequireDefault(_citeproc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var citeproc = _citeproc2.default.PROCESSOR_VERSION;

exports.cite = _package.version;
exports.citeproc = citeproc;