'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _regex = require('./regex');

var _regex2 = _interopRequireDefault(_regex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get CSL from name
 *
 * @access protected
 * @method parseName
 *
 * @param {String} name - string
 *
 * @return {Object} The CSL object
 */
var parseName = function parseName() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (typeof name !== 'string') {
    name = name + '';
  }

  var _ref = name.includes(', ') ? name.split(', ').reverse() : name.split(_regex2.default.name),
      _ref2 = _slicedToArray(_ref, 2),
      given = _ref2[0],
      family = _ref2[1];

  return family ? { given: given, family: family } : { literal: given };
};

exports.default = parseName;