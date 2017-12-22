'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchFile = require('../../../util/fetchFile');

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fetchFile).default;
  }
});

var _fetchFileAsync = require('../../../util/fetchFileAsync');

Object.defineProperty(exports, 'parseAsync', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_fetchFileAsync).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scope = exports.scope = '@else';
var types = exports.types = '@else/url';