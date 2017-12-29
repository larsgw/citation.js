'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var register = {};

var validate = function validate(name, formatter) {
  if (typeof name !== 'string') {
    throw new TypeError('Invalid output format name, expected string, got ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
  } else if (typeof formatter !== 'function') {
    throw new TypeError('Invalid formatter, expected function, got ' + (typeof formatter === 'undefined' ? 'undefined' : _typeof(formatter)));
  }
};

var add = exports.add = function add(name, formatter) {
  validate(name, formatter);

  register[name] = formatter;
};

var remove = exports.remove = function remove(name) {
  delete register[name];
};

var has = exports.has = function has(name) {
  return register.hasOwnProperty(name);
};

var list = exports.list = function list() {
  return Object.keys(register);
};

var format = exports.format = function format(name) {
  for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    options[_key - 1] = arguments[_key];
  }

  if (!has(name)) {
    logger.error('[get]', 'Output plugin "' + name + '" unavailable');
    return undefined;
  }
  return register[name].apply(register, options);
};