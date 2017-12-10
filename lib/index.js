'use strict';

require('babel-polyfill');

require('./logger');

var _static = require('./Cite/static');

var staticMethods = _interopRequireWildcard(_static);

var _index = require('./get/index');

var get = _interopRequireWildcard(_index);

var _index2 = require('./CSL/index');

var CSL = _interopRequireWildcard(_index2);

var _index3 = require('./parse/index');

var parse = _interopRequireWildcard(_index3);

var _index4 = require('./util/index');

var util = _interopRequireWildcard(_index4);

var _version = require('./version');

var version = _interopRequireWildcard(_version);

var _index5 = require('./async/index');

var _index6 = _interopRequireDefault(_index5);

var _index7 = require('./Cite/index');

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

Object.assign(_index8.default, staticMethods, {
  async: _index6.default,
  get: get,
  CSL: CSL,
  parse: parse,
  util: util,
  version: version,
  input: parse.input.chain,
  inputAsync: parse.input.async.chain
});

module.exports = _index8.default;