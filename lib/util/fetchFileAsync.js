"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("isomorphic-fetch");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var fetchFileAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
    var opts,
        reqOpts,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            reqOpts = {};

            if (opts.headers) {
              reqOpts.headers = opts.headers;
              reqOpts.allowRedirectHeaders = Object.keys(opts.headers);
            }

            _context.prev = 3;
            return _context.abrupt("return", fetch(url, reqOpts).then(function (response) {
              return response.text();
            }));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](3);
            logger.error('[set]', "File '".concat(url, "' could not be fetched:"), _context.t0.message);
            return _context.abrupt("return", '[]');

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 7]]);
  }));

  return function fetchFileAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = fetchFileAsync;
exports.default = _default;