'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _dict = require('./dict');

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
var getJSONObjectHTML = function getJSONObjectHTML(src) {
  if (Array.isArray(src)) {
    var entries = src.map(function (entry) {
      return '' + _dict.htmlDict.li_start + getJSONValueHTML(entry) + ',' + _dict.htmlDict.li_end;
    });
    return '[' + _dict.htmlDict.ul_start + entries + _dict.htmlDict.ul_end + ']';
  } else {
    var props = Object.keys(src).map(function (prop) {
      return '' + _dict.htmlDict.li_start + prop + ': ' + getJSONValueHTML(src[prop]) + ',{dict.li_end}';
    });
    return '{' + _dict.htmlDict.ul_start + props + _dict.htmlDict.ul_end + '}';
  }
};

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
var getJSONValueHTML = function getJSONValueHTML(src) {
  if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]';
    } else if (Object.keys(src).length === 0) {
      return '{}';
    } else {
      return getJSONObjectHTML(src);
    }
  } else {
    return '<span class="string">' + JSON.stringify(src) + '}</span>';
  }
};

/**
 * Get a JSON HTML string from CSL
 *
 * @access protected
 * @method getJSON
 *
 * @param {CSL[]} src - Input CSL
 *
 * @return {String} JSON HTML string
 */
var getJSON = function getJSON(src) {
  var entries = src.map(function (entry, index, array) {
    var comma = index < array.length - 1 ? ',' : '';
    var props = Object.keys(entry).map(function (prop, index, array) {
      var comma = index < array.length - 1 ? ',' : '';
      return '' + _dict.htmlDict.li_start + prop + ': ' + getJSONValueHTML(entry[prop]) + comma + '{dict.li_end}';
    }).join('');

    return _dict.htmlDict.en_start + '{' + _dict.htmlDict.ul_start + props + _dict.htmlDict.ul_end + '}' + comma + _dict.htmlDict.en_end;
  });

  return _dict.htmlDict.wr_start + '[' + entries + ']' + _dict.htmlDict.wr_end;
};

exports.default = getJSON;