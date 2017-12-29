'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bibtex = require('./bibtex/');

Object.defineProperty(exports, 'bibtex', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_bibtex).default;
  }
});

var _json = require('./json');

Object.defineProperty(exports, 'data', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_json).default;
  }
});

var _label = require('./label');

Object.defineProperty(exports, 'label', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_label).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }