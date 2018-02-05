"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepCopy = _interopRequireDefault(require("../../../util/deepCopy"));

var _registrar = require("../../registrar/");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var parseInputChainLinkAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
    var type, output;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = (0, _registrar.type)(input);
            output = type.match(/array|object/) ? (0, _deepCopy.default)(input) : input;
            return _context.abrupt("return", (0, _registrar.dataAsync)(output, type));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function parseInputChainLinkAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = parseInputChainLinkAsync;
exports.default = _default;