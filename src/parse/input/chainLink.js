import deepCopy from '../../util/deepCopy'

import parseInputType from './type'
import parseInputData from './data'

/**
 * Parse input once.
 * 
 * @access private
 * @method parseInputChainLink
 * 
 * @param {String|String[]|Object|Object[]} input - The input data
 * 
 * @return {CSL[]} The parsed input
 */
var parseInputChainLink = function ( input ) {
  var type = parseInputType( input )
  
  if ( type.match(/^(array|object)\//) )
    input = deepCopy( input )
  
  return parseInputData( input, type )
}

export default parseInputChainLink