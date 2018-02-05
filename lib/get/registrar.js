"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = exports.list = exports.has = exports.remove = exports.add = exports.register = void 0;

var _register = _interopRequireDefault(require("../util/register"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var validate = function validate(name, formatter) {
  if (typeof name !== 'string') {
    throw new TypeError("Invalid output format name, expected string, got ".concat(_typeof(name)));
  } else if (typeof formatter !== 'function') {
    throw new TypeError("Invalid formatter, expected function, got ".concat(_typeof(formatter)));
  }
};

var register = new _register.default();
exports.register = register;

var add = function add(name, formatter) {
  validate(name, formatter);
  register.set(name, formatter);
};

exports.add = add;

var remove = function remove(name) {
  register.remove(name);
};

exports.remove = remove;

var has = function has(name) {
  return register.has(name);
};

exports.has = has;

var list = function list() {
  return register.list();
};

exports.list = list;

var format = function format(name, data) {
  if (!register.has(name)) {
    logger.error('[get]', "Output plugin \"".concat(name, "\" unavailable"));
    return undefined;
  }

  for (var _len = arguments.length, options = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    options[_key - 2] = arguments[_key];
  }

  return register.get(name).apply(void 0, [data].concat(options));
};

exports.format = format;