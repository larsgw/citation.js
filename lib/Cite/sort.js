'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = undefined;

var _label = require('../get/modules/label');

var _name = require('../get/name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getComparisonValue = function getComparisonValue(obj, prop) {
  var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : prop === 'label';

  var value = label ? (0, _label.getLabel)(obj) : obj[prop];

  switch (prop) {
    case 'author':
    case 'editor':
      return value.map(function (name) {
        return name.literal || name.family || (0, _name2.default)(name);
      });

    case 'accessed':
    case 'issued':
      return value['date-parts'][0];

    case 'page':
      return value.split('-').map(function (num) {
        return parseInt(num);
      });

    case 'edition':
    case 'issue':
    case 'volume':
      value = parseInt(value);
      return !isNaN(value) ? value : -Infinity;

    default:
      return value || -Infinity;
  }
};

var compareProp = function compareProp(a, b, prop) {
  var flip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : /^!/.test(prop);

  prop = prop.replace(/^!/, '');
  var valueA = getComparisonValue(a, prop);
  var valueB = getComparisonValue(b, prop);

  return valueA === valueB ? 0 : flip !== valueA > valueB ? 1 : -1;
};

var getSortCallback = function getSortCallback() {
  for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }

  return function (a, b) {
    var keys = props.slice();
    var output = 0;

    while (!output && keys.length) {
      output = compareProp(a, b, keys.shift());
    }

    return output;
  };
};

var sort = function sort() {
  var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var log = arguments[1];

  if (log) {
    this.save();
  }

  this.data.sort(typeof method === 'function' ? method : getSortCallback.apply(undefined, _toConsumableArray(method).concat(['label'])));

  return this;
};

exports.sort = sort;