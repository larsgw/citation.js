"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getDate = function getDate(_ref) {
  var _ref$dateParts = _slicedToArray(_ref['date-parts'], 1),
      date = _ref$dateParts[0];

  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';

  if (date.length !== 3) {
    return '';
  }

  var _date$map = date.map(function (part) {
    return part.toString();
  }),
      _date$map2 = _slicedToArray(_date$map, 3),
      year = _date$map2[0],
      month = _date$map2[1],
      day = _date$map2[2];

  return [year.padStart(4, '0'), month.padStart(2, '0'), day.padStart(2, '0')].join(delimiter);
};

var _default = getDate;
exports.default = _default;