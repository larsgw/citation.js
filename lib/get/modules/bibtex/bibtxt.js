'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBibtxt = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

var _dict = require('../../dict');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getBibtxt = function getBibtxt(src, dict) {
  var entries = src.map(function (entry) {
    var bib = (0, _json2.default)(entry);
    bib.properties.type = bib.type;
    var properties = Object.entries(bib.properties).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          prop = _ref2[0],
          value = _ref2[1];

      return dict.listItem.join(prop + ': ' + value);
    }).join('');

    return dict.entry.join('[' + bib.label + ']' + dict.list.join(properties));
  }).join('\n');

  return dict.bibliographyContainer.join(entries);
};

var getBibtxtWrapper = function getBibtxtWrapper(src, html) {
  var dict = (0, _dict.get)(html ? 'html' : 'text');
  return getBibtxt(src, dict);
};

exports.getBibtxt = getBibtxt;
exports.default = getBibtxtWrapper;