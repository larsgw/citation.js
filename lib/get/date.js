'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getDate = function getDate(_ref) {
  var _ref$dateParts = _slicedToArray(_ref['date-parts'], 1),
      date = _ref$dateParts[0];

  if (date.length === 3) {
    var _date$map = date.map(function (part) {
      return part.toString();
    }),
        _date$map2 = _slicedToArray(_date$map, 3),
        year = _date$map2[0],
        month = _date$map2[1],
        day = _date$map2[2];

    return year.padStart(4, '0') + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
  } else {
    return '';
  }
};

exports.default = getDate;