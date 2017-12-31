'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('./locales');

require('./styles');

var _bibliography = require('./bibliography');

var _bibliography2 = _interopRequireDefault(_bibliography);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [{
  name: 'bibliography',
  formatter: _bibliography2.default
}];