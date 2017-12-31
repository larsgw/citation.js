'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = exports.list = exports.has = exports.remove = exports.add = exports.register = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _register = require('../util/register');

var _register2 = _interopRequireDefault(_register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validate = function validate(name, formatter) {
  if (typeof name !== 'string') {
    throw new TypeError('Invalid output format name, expected string, got ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
  } else if (typeof formatter !== 'function') {
    throw new TypeError('Invalid formatter, expected function, got ' + (typeof formatter === 'undefined' ? 'undefined' : _typeof(formatter)));
  }
};

var register = exports.register = new _register2.default();

var add = exports.add = function add(name, formatter) {
  validate(name, formatter);

  register.set(name, formatter);
};

var remove = exports.remove = function remove(name) {
  register.remove(name);
};

var has = exports.has = function has(name) {
  return register.has(name);
};

var list = exports.list = function list() {
  return register.list();
};

var format = exports.format = function format(name, data) {
  for (var _len = arguments.length, options = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    options[_key - 2] = arguments[_key];
  }

  if (!register.has(name)) {
    logger.error('[get]', 'Output plugin "' + name + '" unavailable');
    return undefined;
  }
  return register.get(name).apply(undefined, [data].concat(options));
};