"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getBibtex = void 0;

var _json = _interopRequireDefault(require("./json"));

var _dict = require("../../dict");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var syntaxTokens = {
  '|': '{\\textbar}',
  '<': '{\\textless}',
  '>': '{\\textgreater}',
  '~': '{\\textasciitilde}',
  '^': '{\\textasciicircum}',
  '\\': '{\\textbackslash}',
  '{': '\\{\\vphantom{\\}}',
  '}': '\\vphantom{\\{}\\}'
};
var caseSensitive = ['title'];
var bracketMappings = {
  '': '',
  '{': '}',
  '{{': '}}'
};

var wrapInBrackets = function wrapInBrackets(prop, value) {
  var delStart = !isNaN(+value) ? '' : caseSensitive.includes(prop) ? '{{' : '{';
  var delEnd = bracketMappings[delStart];
  return delStart + value + delEnd;
};

var getBibtex = function getBibtex(src, dict) {
  var entries = src.map(function (sourceEntry) {
    var entry = (0, _json.default)(sourceEntry);
    var properties = Object.entries(entry.properties).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          prop = _ref2[0],
          value = _ref2[1];

      value = value.replace(/[|<>~^\\{}]/g, function (match) {
        return syntaxTokens[match];
      });
      return dict.listItem.join("".concat(prop, "=").concat(wrapInBrackets(prop, value), ","));
    }).join('');
    return dict.entry.join("@".concat(entry.type, "{").concat(entry.label, ",").concat(dict.list.join(properties), "}"));
  }).join('');
  return dict.bibliographyContainer.join(entries);
};

exports.getBibtex = getBibtex;

var getBibTeXWrapper = function getBibTeXWrapper(src, html) {
  var dict = (0, _dict.get)(html ? 'html' : 'text');
  return getBibtex(src, dict);
};

var _default = getBibTeXWrapper;
exports.default = _default;