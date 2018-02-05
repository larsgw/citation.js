"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("isomorphic-fetch");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var fetchFileAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(url);

          case 3:
            return _context.abrupt("return", _context.sent.text());

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            logger.error('[set]', "File '".concat(url, "' could not be fetched:"), _context.t0.message);
            return _context.abrupt("return", '[]');

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function fetchFileAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = fetchFileAsync;
exports.default = _default;