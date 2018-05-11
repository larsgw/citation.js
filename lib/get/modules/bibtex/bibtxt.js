"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getBibtxt = void 0;

var _json = _interopRequireDefault(require("./json"));

var _dict = require("../../dict");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getBibtxt = function getBibtxt(src, dict) {
  var entries = src.map(function (entry) {
    var bib = (0, _json.default)(entry);
    bib.properties.type = bib.type;
    var properties = Object.entries(bib.properties).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          prop = _ref2[0],
          value = _ref2[1];

      return dict.listItem.join("".concat(prop, ": ").concat(value));
    }).join('');
    return dict.entry.join("[".concat(bib.label, "]").concat(dict.list.join(properties)));
  }).join('\n');
  return dict.bibliographyContainer.join(entries);
};

exports.getBibtxt = getBibtxt;

var getBibtxtWrapper = function getBibtxtWrapper(src, html) {
  var dict = (0, _dict.get)(html ? 'html' : 'text');
  return getBibtxt(src, dict);
};

var _default = getBibtxtWrapper;
exports.default = _default;