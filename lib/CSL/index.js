'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.item = exports.engine = exports.locale = exports.style = undefined;

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

var _locales = require('./locales');

var _locales2 = _interopRequireDefault(_locales);

var _engines = require('./engines');

var _engines2 = _interopRequireDefault(_engines);

var _items = require('./items');

var _items2 = _interopRequireDefault(_items);

var _register = require('./register');

var register = _interopRequireWildcard(_register);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.style = _styles2.default;
exports.locale = _locales2.default;
exports.engine = _engines2.default;
exports.item = _items2.default;
exports.register = register;