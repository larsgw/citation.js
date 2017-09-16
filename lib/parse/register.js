'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._ = exports.dataAsync = exports.data = exports.type = exports.add = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _type = require('./input/type');

var _type2 = _interopRequireDefault(_type);

var _data2 = require('./input/data');

var _data3 = _interopRequireDefault(_data2);

var _data4 = require('./input/async/data');

var _data5 = _interopRequireDefault(_data4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = [];
var parsers = {};
var async = {};
var _ = {};

var typeMatcher = /^(?:(.+?)\/)?(.+?)(?:\/(.+?))?$/; // /^(?:@(.+?))(?:\/(.+?))?(?:\/(.+?))?$/

var capitalize = function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
};
var camelCase = function camelCase() {
  for (var _len = arguments.length, words = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    words[_key - 1] = arguments[_key];
  }

  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return prefix.toLowerCase() + words.map(capitalize).join('');
};
var getMethodName = function getMethodName(type) {
  return camelCase.apply(undefined, _toConsumableArray(type.match(typeMatcher).slice(1).filter(Boolean)));
};

var addTypeParser = function addTypeParser(format, type) {
  var index = types.findIndex(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        comparison = _ref2[0];

    return format === comparison;
  });
  if (index !== -1) {
    types[index][1] = type;
  } else {
    types.push([format, type]);
  }
};

var add = function add(format) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      type = _ref3.type,
      data = _ref3.data,
      dataAsync = _ref3.dataAsync;

  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name'); //, expected name starting with \'@\'')
  } else if (type && typeof type !== 'function' && !(type instanceof RegExp)) {
    throw new TypeError('Invalid type parser, expected callback or regex, got ' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)));
  } else if (data && typeof data !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + (typeof data === 'undefined' ? 'undefined' : _typeof(data)));
  } else if (dataAsync && typeof dataAsync !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + (typeof dataAsync === 'undefined' ? 'undefined' : _typeof(dataAsync)));
  }

  var methodName = getMethodName(format);

  if (typeof type === 'function') {
    addTypeParser(format, type);
  } else if (type instanceof RegExp) {
    addTypeParser(format, type.test.bind(type));
  }

  if (data) {
    parsers[format] = _[methodName] = data;
  }

  if (dataAsync) {
    parsers[format] = _[methodName + 'Async'] = dataAsync;
  }
};

var type = function type(data) {
  var result = types.find(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        _ = _ref5[0],
        typeParser = _ref5[1];

    return typeParser(data);
  });

  if (result === undefined) {
    // TODO could not match type
    // return 'invalid'
    return (0, _type2.default)(data);
  } else {
    return result[0];
  }
};

var data = function data(_data, type) {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](_data);
  } else {
    // TODO ERROR 404 parser not found
    // return []
    return (0, _data3.default)(_data, type);
  }
};

var dataAsync = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data, type) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!async.hasOwnProperty(type)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', async[type](data));

          case 4:
            return _context.abrupt('return', (0, _data5.default)(data, type));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function dataAsync(_x3, _x4) {
    return _ref6.apply(this, arguments);
  };
}();

exports.add = add;
exports.type = type;
exports.data = data;
exports.dataAsync = dataAsync;
exports._ = _;