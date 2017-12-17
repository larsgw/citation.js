'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasDataParser = exports.addDataParser = exports.dataAsync = exports.data = undefined;

var _type = require('./type');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var parsers = {};
var asyncParsers = {};
var nativeParsers = {};
var nativeAsyncParsers = {};

var _ = {};

var methodNames = {};

var capitalize = function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};
var camelCase = function camelCase() {
  for (var _len = arguments.length, words = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    words[_key - 1] = arguments[_key];
  }

  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return prefix.toLowerCase() + words.map(capitalize).join('');
};

var getMethodName = function getMethodName(format) {
  if (!methodNames[format]) {
    methodNames[format] = camelCase.apply(undefined, _toConsumableArray(format.match(_type.typeMatcher).slice(1).filter(Boolean)));
  }
  return methodNames[format];
};

var hasDataParser = function hasDataParser(type) {
  var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return async ? asyncParsers[type] || nativeAsyncParsers[type] : parsers[type] || nativeParsers[type];
};

var data = function data(input, type) {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](input);
  } else if (nativeParsers.hasOwnProperty(type)) {
    return nativeParsers[type](input);
  } else {
    logger.error('[set]', 'No synchronous parser found for ' + type);
    return null;
  }
};

var dataAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input, type) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!asyncParsers.hasOwnProperty(type)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', asyncParsers[type](input));

          case 4:
            if (!nativeAsyncParsers.hasOwnProperty(type)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', nativeAsyncParsers[type](input));

          case 8:
            if (!hasDataParser(type, false)) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', data(input, type));

          case 12:
            logger.error('[set]', 'No parser found for ' + type);
            return _context.abrupt('return', null);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function dataAsync(_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var addDataParser = function addDataParser(format, parser) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$async = _ref2.async,
      async = _ref2$async === undefined ? false : _ref2$async,
      _ref2$native = _ref2.native,
      native = _ref2$native === undefined ? false : _ref2$native;

  var methodName = getMethodName(format);
  var parserObject = void 0;

  if (async) {
    methodName += 'Async';
    parserObject = native ? nativeAsyncParsers : asyncParsers;
  } else {
    parserObject = native ? nativeParsers : parsers;
  }

  parserObject[format] = _[methodName] = parser;
};

exports.data = data;
exports.dataAsync = dataAsync;
exports.addDataParser = addDataParser;
exports.hasDataParser = hasDataParser;