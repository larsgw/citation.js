'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.citeproc = exports.cite = undefined;

var _package = require('../package.json');

var _citeproc = require('citeproc');

exports.cite = _package.version;
exports.citeproc = _citeproc.PROCESSOR_VERSION;