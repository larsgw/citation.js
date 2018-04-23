"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeGraph = exports.applyGraph = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var applyGraph = function applyGraph(entry, graph) {
  var isArrayElse = function isArrayElse(_ref) {
    var type = _ref.type;
    return type === '@else/list+object';
  };

  if (!Array.isArray(entry._graph)) {
    entry._graph = graph;
  } else if (graph.find(isArrayElse)) {
    graph.splice.apply(graph, [graph.findIndex(isArrayElse), 1].concat(_toConsumableArray(entry._graph.slice(0, -1))));
    entry._graph = graph;
  }

  return entry;
};

exports.applyGraph = applyGraph;

var removeGraph = function removeGraph(entry) {
  delete entry._graph;
  return entry;
};

exports.removeGraph = removeGraph;