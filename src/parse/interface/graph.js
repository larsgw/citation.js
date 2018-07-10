/**
 * Apply a parse chain graph to an element
 *
 * @access protected
 * @memberof Cite.plugins.input.util
 *
 * @param {CSL} entry
 * @param {Array<Object>} graph
 *
 * @return {CSL} entry
 */
export const applyGraph = (entry, graph) => {
  const isArrayElse = ({type}) => type === '@else/list+object'

  if (!Array.isArray(entry._graph)) {
    entry._graph = graph
  } else if (graph.find(isArrayElse)) {
    graph.splice(graph.findIndex(isArrayElse), 1, ...entry._graph.slice(0, -1))
    entry._graph = graph
  }

  return entry
}

/**
 * Remove the parse chain graph from an element
 *
 * @access protected
 * @memberof Cite.plugins.input.util
 *
 * @param {CSL} entry
 *
 * @return {CSL} entry
 */
export const removeGraph = (entry) => {
  delete entry._graph
  return entry
}
