"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasDataParser = exports.addDataParser = exports.dataAsync = exports.data = void 0;

var _chain = require("./chain");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var flatten = function flatten(array) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(array));
};

var parsers = {};
var asyncParsers = {};
var nativeParsers = {
  '@csl/object': function cslObject(input) {
    return [input];
  },
  '@csl/list+object': function cslListObject(input) {
    return input;
  },
  '@else/list+object': function elseListObject(input) {
    return flatten(input.map(_chain.chain));
  }
};
var nativeAsyncParsers = {
  '@else/list+object': function () {
    var _elseListObject = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = flatten;
              _context.next = 3;
              return Promise.all(input.map(_chain.chainAsync));

            case 3:
              _context.t1 = _context.sent;
              return _context.abrupt("return", (0, _context.t0)(_context.t1));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function elseListObject(_x) {
      return _elseListObject.apply(this, arguments);
    };
  }()
};

var data = function data(input, type) {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](input);
  } else if (nativeParsers.hasOwnProperty(type)) {
    return nativeParsers[type](input);
  } else {
    logger.error('[set]', "No synchronous parser found for ".concat(type));
    return null;
  }
};

exports.data = data;

var dataAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(input, type) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!asyncParsers.hasOwnProperty(type)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", asyncParsers[type](input));

          case 4:
            if (!nativeAsyncParsers.hasOwnProperty(type)) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", nativeAsyncParsers[type](input));

          case 8:
            if (!hasDataParser(type, false)) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", data(input, type));

          case 12:
            logger.error('[set]', "No parser found for ".concat(type));
            return _context2.abrupt("return", null);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function dataAsync(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.dataAsync = dataAsync;

var addDataParser = function addDataParser(format, _ref3) {
  var parser = _ref3.parser,
      async = _ref3.async;

  if (async) {
    asyncParsers[format] = parser;
  } else {
    parsers[format] = parser;
  }
};

exports.addDataParser = addDataParser;

var hasDataParser = function hasDataParser(type) {
  var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return async ? asyncParsers[type] || nativeAsyncParsers[type] : parsers[type] || nativeParsers[type];
};

exports.hasDataParser = hasDataParser;