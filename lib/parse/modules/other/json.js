"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var substituters = [[/((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g, '$1"$2"'], [/((?:(?:"|]|}|\/[gmiuys]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g, '$1"$2$3$4"$5:']];

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

exports.default = exports.parse = parseJSON;
var scope = '@else';
exports.scope = scope;
var types = '@else/json';
exports.types = types;