"use strict";

var _data = require("../registrar/data");

var _input = require("../input/");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var nativeParsers = {
  '@csl/object': function cslObject(input) {
    return [input];
  },
  '@csl/list+object': function cslListObject(input) {
    return input;
  },
  '@else/list+object': function elseListObject(input) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(input.map(_input.chain)));
  }
};
var nativeAsyncParsers = {
  '@else/list+object': function () {
    var _elseListObject = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
      var _ref2;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = (_ref2 = []).concat;
              _context.t1 = _ref2;
              _context.t2 = _toConsumableArray;
              _context.next = 5;
              return Promise.all(input.map(_input.chainAsync));

            case 5:
              _context.t3 = _context.sent;
              _context.t4 = (0, _context.t2)(_context.t3);
              return _context.abrupt("return", _context.t0.apply.call(_context.t0, _context.t1, _context.t4));

            case 8:
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

for (var nativeParser in nativeParsers) {
  (0, _data.addDataParser)(nativeParser, nativeParsers[nativeParser], {
    async: false,
    native: true
  });
}

for (var nativeAsyncParser in nativeAsyncParsers) {
  (0, _data.addDataParser)(nativeAsyncParser, nativeAsyncParsers[nativeAsyncParser], {
    async: true,
    native: true
  });
}