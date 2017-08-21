'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 *
 * @access private
 * @constant bibTxtRegex
 * @default
 */
var bibTxtRegex = {
  splitEntries: /\n\s*(?=\[)/g,
  parseEntry: /^\[(.+?)\]\s*(?:\n([\s\S]+))?$/,
  splitPairs: /((?=.)\s)*\n\s*/g,
  parsePair: /^(.+?)\s*:\s*(.+)$/

  /**
   * Parse single Bib.TXT entry
   *
   * @access protected
   * @method parseBibTxtEntry
   *
   * @param {String} entry - The input data
   *
   * @return {Object} Array of BibTeX-JSON
   */
};var parseBibTxtEntry = function parseBibTxtEntry(entry) {
  var _ref = entry.match(bibTxtRegex.parseEntry) || [],
      _ref2 = _slicedToArray(_ref, 3),
      label = _ref2[1],
      pairs = _ref2[2];

  if (!label || !pairs) {
    return {};
  } else {
    var out = {
      type: 'book',
      label: label,
      properties: {}
    };

    pairs.trim().split(bibTxtRegex.splitPairs).filter(function (v) {
      return v;
    }).forEach(function (pair) {
      var _ref3 = pair.match(bibTxtRegex.parsePair) || [],
          _ref4 = _slicedToArray(_ref3, 3),
          key = _ref4[1],
          value = _ref4[2];

      if (key) {
        if (key === 'type') {
          out.type = value;
        } else {
          out.properties[key] = value;
        }
      }
    });

    return out;
  }
};

/**
 * Format Bib.TXT data
 *
 * @access protected
 * @method parseBibTxt
 *
 * @param {String} src - The input data
 *
 * @return {Array<Object>} Array of BibTeX-JSON
 */
var parseBibTxt = function parseBibTxt(src) {
  return src.trim().split(bibTxtRegex.splitEntries).map(parseBibTxtEntry);
};

exports.text = parseBibTxt;
exports.textEntry = parseBibTxtEntry;