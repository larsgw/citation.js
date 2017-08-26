'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Apply a parse chain graph to an element
 *
 * @access protected
 * @method applyGraph
 *
 * @param {CSL} entry
 * @param {Array<Object>} graph
 *
 * @return {CSL} entry
 */
var applyGraph = function applyGraph(entry, graph) {
  var isArrayElse = function isArrayElse(_ref) {
    var type = _ref.type;
    return type === 'array/else';
  };

  if (!Array.isArray(entry._graph)) {
    entry._graph = graph;
  } else if (graph.find(isArrayElse)) {
    graph.splice.apply(graph, [graph.findIndex(isArrayElse), 1].concat(_toConsumableArray(entry._graph.slice(0, -1))));
    entry._graph = graph;
  }

  return entry;
};

/**
 * Remove the parse chain graph from an element
 *
 * @access protected
 * @method removeGraph
 *
 * @param {CSL} entry
 *
 * @return {CSL} entry
 */
var removeGraph = function removeGraph(entry) {
  delete entry._graph;
  return entry;
};

exports.applyGraph = applyGraph;
exports.removeGraph = removeGraph;