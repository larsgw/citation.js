"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chainLinkAsync = exports.chainAsync = exports.chainLink = exports.chain = void 0;

var _deepCopy = _interopRequireDefault(require("../../util/deepCopy"));

var _type = require("./type");

var _data = require("./data");

var _graph = require("./graph");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var chain = function chain(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$maxChainLeng = options.maxChainLength,
      maxChainLength = _options$maxChainLeng === void 0 ? 10 : _options$maxChainLeng,
      _options$generateGrap = options.generateGraph,
      generateGraph = _options$generateGrap === void 0 ? true : _options$generateGrap,
      forceType = options.forceType;
  var type = forceType || (0, _type.type)(input);
  var output = type.match(/object$/) ? (0, _deepCopy.default)(input) : input;
  var graph = [{
    type: type,
    data: input
  }];

  while (type !== '@csl/list+object') {
    if (maxChainLength-- <= 0) {
      logger.error('[set]', 'Max. number of parsing iterations reached');
      return [];
    }

    output = (0, _data.data)(output, type);
    type = (0, _type.type)(output);
    graph.push({
      type: type
    });
  }

  return output.map(generateGraph ? function (entry) {
    return (0, _graph.applyGraph)(entry, graph);
  } : _graph.removeGraph);
};

exports.chain = chain;

var chainLink = function chainLink(input) {
  var type = (0, _type.type)(input);
  var output = type.match(/array|object/) ? (0, _deepCopy.default)(input) : input;
  return (0, _data.data)(output, type);
};

exports.chainLink = chainLink;

var chainAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
    var options,
        _options$maxChainLeng2,
        maxChainLength,
        _options$generateGrap2,
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
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            _options$maxChainLeng2 = options.maxChainLength, maxChainLength = _options$maxChainLeng2 === void 0 ? 10 : _options$maxChainLeng2, _options$generateGrap2 = options.generateGraph, generateGraph = _options$generateGrap2 === void 0 ? true : _options$generateGrap2, forceType = options.forceType;
            type = forceType || (0, _type.type)(input);
            output = type.match(/array|object/) ? (0, _deepCopy.default)(input) : input;
            graph = [{
              type: type,
              data: input
            }];

          case 5:
            if (!(type !== '@csl/list+object')) {
              _context.next = 16;
              break;
            }

            if (!(maxChainLength-- <= 0)) {
              _context.next = 9;
              break;
            }

            logger.error('[set]', 'Max. number of parsing iterations reached');
            return _context.abrupt("return", []);

          case 9:
            _context.next = 11;
            return (0, _data.dataAsync)(output, type);

          case 11:
            output = _context.sent;
            type = (0, _type.type)(output);
            graph.push({
              type: type
            });
            _context.next = 5;
            break;

          case 16:
            return _context.abrupt("return", output.map(generateGraph ? function (entry) {
              return (0, _graph.applyGraph)(entry, graph);
            } : _graph.removeGraph));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function chainAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.chainAsync = chainAsync;

var chainLinkAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(input) {
    var type, output;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = (0, _type.type)(input);
            output = type.match(/array|object/) ? (0, _deepCopy.default)(input) : input;
            return _context2.abrupt("return", (0, _data.dataAsync)(output, type));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function chainLinkAsync(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.chainLinkAsync = chainLinkAsync;