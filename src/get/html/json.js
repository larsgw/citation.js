import dict from './dict'

/**
 * Convert a JSON array or object to HTML.
 * 
 * @access private
 * @function getJSONObjectHTML
 * 
 * @param {Object|Object[]|String[]|Number[]} src - The data
 * 
 * @return {String} The html (in string form)
 */

var getJSONObjectHTML = function ( src ) {
  var res = ''
  
  if ( Array.isArray( src ) ) {
    
    res += '[<ul style="list-style-type:none">';
    
    for ( var entryIndex = 0; entryIndex < src.length; entryIndex++ ) {
      var entry = src[ entryIndex ]
      
      res += '<li>'
      res += getJSONValueHTML( entry )
      res += ',</li>'
      
    } 
    
    res += '</ul>]'
    
  } else if ( src !== null ) {
    
    res += '{<ul style="list-style-type:none">';
    
    for ( var prop in src ) {
      
      var entry = src[ prop ]
      
      res += '<li><span class="key">' + prop + '</span><span class="delimiter">:</span>'
      res += getJSONValueHTML( entry )
      res += ',</li>'
      
    }
    
    res += '</ul>}'
  }
  
  return res
}

/**
 * Convert JSON to HTML.
 * 
 * @access private
 * @function getJSONValueHTML
 * 
 * @param {Object|String|Number|Object[]|String[]|Number[]} src - The data
 * 
 * @return {String} The html (in string form)
 */
var getJSONValueHTML = function ( src ) {
  var res = ''
  
  if ( typeof src === 'object' && src !== null ) {
    
    if ( src.length === 0 )
      res += '[]'
    else if ( Object.keys( src ).length === 0 )
      res += '{}'
    else
      res += getJSONObjectHTML( src )
    
  } else res += '<span class="string">' + JSON.stringify( src ) + '</span>'
  
  return res
}

/**
 * Get a JSON HTML string from CSL
 * 
 * @access private
 * @method getJSON
 * 
 * @param {CSL[]} src - Input CSL
 * 
 * @return {String} JSON HTML string
 */
var getJSON = function ( src ) {
  var res = ''
    , dict= varHTMLDict
  
  res += dict.wr_start
  res += '['
  
  for ( var i = 0; i < src.length; i++ ) {
    var entry = src[ i ]
    
    res += dict.en_start
    res += '{'
    
    res += dict.ul_start
    res += dict.li_start
    
    var props = Object.keys( entry )
    
    for ( var propIndex = 0; propIndex < props.length; propIndex++ ) {
      var prop = props[ propIndex ]
        , value= entry[ prop ]
      
      res += prop + ':' + getJSONValueHTML( value )
      
      if ( propIndex + 1 < props.length )
        res += ',',
        res += dict.li_end,
        res += dict.li_start
    }
    
    res += dict.li_end
    res += dict.ul_end
    
    res += '}'
    
    if ( i + 1 < src.length )
      res += ','
    
    res += dict.en_end
  }
  
  res += dict.wr_end
  res += ']'
  
  return res
}

export default getJSON