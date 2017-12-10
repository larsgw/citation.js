'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepCopy = require('../../util/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _registrar = require('../registrar/');

var _graph = require('./graph');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseInput = function parseInput(input) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$maxChainLength = _ref.maxChainLength,
      maxChainLength = _ref$maxChainLength === undefined ? 10 : _ref$maxChainLength,
      _ref$generateGraph = _ref.generateGraph,
      generateGraph = _ref$generateGraph === undefined ? true : _ref$generateGraph,
      forceType = _ref.forceType;

  var type = forceType || (0, _registrar.type)(input);
  var output = type.match(/object$/) ? (0, _deepCopy2.default)(input) : input;

  var graph = [{ type: type, data: input }];

  while (type !== '@csl/list+object') {
    if (maxChainLength-- <= 0) {
      logger.error('[set]', 'Max. number of parsing iterations reached');
      return [];
    }

    output = (0, _registrar.data)(output, type);
    type = (0, _registrar.type)(output);
    graph.push({ type: type });
  }

  return output.map(generateGraph ? function (entry) {
    return (0, _graph.applyGraph)(entry, graph);
  } : _graph.removeGraph);
};

exports.default = parseInput;