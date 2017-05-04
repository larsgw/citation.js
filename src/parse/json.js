import varRegex from './regex'

/**
 * Parse (in)valid JSON
 * 
 * @access private
 * @method parseJSON
 * 
 * @param {String} str - The input string
 * 
 * @return {Object|Object[]|String[]} The parsed object
 */
var parseJSON = function ( str ) {
  var object
  try {
    object = JSON.parse( str )
  } catch (e) {
    console.info( '[set]', 'Input was not valid JSON, switching to experimental parser for invalid JSON')
    try {
      object = JSON.parse(
        str
          .replace( varRegex.json[ 0 ][ 0 ], varRegex.json[ 0 ][ 1 ] )
          .replace( varRegex.json[ 1 ][ 0 ], varRegex.json[ 1 ][ 1 ] )
      )
    } catch (e) {
      console.error( '[set]', 'Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.')
    }
  }
  return object
}

export default parseJSON