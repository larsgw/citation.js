"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepCopy = _interopRequireDefault(require("../../../util/deepCopy"));

var _registrar = require("../../registrar/");

var _graph = require("../graph");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var parseInputAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
    var _ref2,
        _ref2$maxChainLength,
        maxChainLength,
        _ref2$generateGraph,
        generateGraph,
        forceType,
        type,
        output,
        graph,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, _ref2$maxChainLength = _ref2.maxChainLength, maxChainLength = _ref2$maxChainLength === void 0 ? 10 : _ref2$maxChainLength, _ref2$generateGraph = _ref2.generateGraph, generateGraph = _ref2$generateGraph === void 0 ? true : _ref2$generateGraph, forceType = _ref2.forceType;
            type = forceType || (0, _registrar.type)(input);
            output = type.match(/array|object/) ? (0, _deepCopy.default)(input) : input;
            graph = [{
              type: type,
              data: input
            }];

          case 4:
            if (!(type !== '@csl/list+object')) {
              _context.next = 15;
              break;
            }

            if (!(maxChainLength-- <= 0)) {
              _context.next = 8;
              break;
            }

            logger.error('[set]', 'Max. number of parsing iterations reached');
            return _context.abrupt("return", []);

          case 8:
            _context.next = 10;
            return (0, _registrar.dataAsync)(output, type);

          case 10:
            output = _context.sent;
            type = (0, _registrar.type)(output);
            graph.push({
              type: type
            });
            _context.next = 4;
            break;

          case 15:
            return _context.abrupt("return", output.map(generateGraph ? function (entry) {
              return (0, _graph.applyGraph)(entry, graph);
            } : _graph.removeGraph));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function parseInputAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = parseInputAsync;
exports.default = _default;