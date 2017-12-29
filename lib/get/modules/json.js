'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJsonWrapper = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _dict = require('../dict');

var appendCommas = function appendCommas(string, index, array) {
  return string + (index < array.length - 1 ? ',' : '');
};

var getJsonObject = function getJsonObject(src, dict) {
  var isArray = Array.isArray(src);
  var entries = void 0;

  if (isArray) {
    entries = src.map(function (entry) {
      return getJsonValue(entry, dict);
    });
  } else {
    entries = Object.entries(src).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          prop = _ref2[0],
          value = _ref2[1];

      return '"' + prop + '": ' + getJsonValue(value, dict);
    });
  }

  entries = appendCommas(entries).map(function (entry) {
    return dict.listItem.join(entry);
  });
  entries = dict.list.join(entries.join(''));

  return isArray ? '[' + entries + ']' : '{' + entries + '}';
};

var getJsonValue = function getJsonValue(src, dict) {
  if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]';
    } else if (Object.keys(src).length === 0) {
      return '{}';
    } else {
      return getJsonObject(src, dict);
    }
  } else {
    return JSON.stringify(src) + '';
  }
};

var getJson = function getJson(src, dict) {
  var entries = src.map(function (entry) {
    return getJsonObject(entry, dict);
  });
  entries = appendCommas(entries).map(function (entry) {
    return dict.entry.join(entry);
  });

  return dict.bibliographyContainer.join('[' + entries + ']');
};

var getJsonWrapper = function getJsonWrapper(src) {
  return getJson(src, (0, _dict.get)('html'));
};

exports.getJsonWrapper = getJsonWrapper;
exports.default = [{
  name: 'data',
  formatter: function formatter(data) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$type = _ref3.type,
        type = _ref3$type === undefined ? 'text' : _ref3$type;

    return (0, _dict.has)(type) ? getJson(data, (0, _dict.get)(type)) : '';
  }
}];