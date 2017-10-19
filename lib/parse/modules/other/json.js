'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 *
 * @access protected
 * @constant substituters
 * @default
 */
var substituters = [[/((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g, '$1"$2"'], [/((?:(?:"|]|}|\/[gmiuys]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g, '$1"$2$3$4"$5:']];

/**
 * Parse (in)valid JSON
 *
 * @access protected
 * @method parseJSON
 *
 * @param {String} str - The input string
 *
 * @return {Object|Array<Object>|Array<String>} The parsed object
 */
var parseJSON = function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    logger.info('[set]', 'Input was not valid JSON, switching to experimental parser for invalid JSON');
    try {
      substituters.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            regex = _ref2[0],
            subst = _ref2[1];

        str = str.replace(regex, subst);
      });
      return JSON.parse(str);
    } catch (e) {
      logger.error('[set]', 'Experimental parser failed. Please improve the JSON. If this is not JSON, please re-read the supported formats.');
      return undefined;
    }
  }
};

var scope = exports.scope = '@else';
var types = exports.types = '@else/json';
exports.parse = parseJSON;
exports.default = parseJSON;