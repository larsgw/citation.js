'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = [];
var parsers = {};
var asyncParsers = {};
var _ = {};

var typeOf = function typeOf(thing) {
  return thing === undefined ? 'Undefined' : thing === null ? 'Null' : thing.constructor.name;
};

var typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/;
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

  if (index === -1) {
    types.push([format, type]);
  } else {
    types[index][1] = type;
  }
};

var add = function add(format) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      parseType = _ref3.parseType,
      parse = _ref3.parse,
      parseAsync = _ref3.parseAsync;

  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name, expected name starting with \'@\'');
  } else if (parseType && typeof parseType !== 'function' && !(parseType instanceof RegExp)) {
    throw new TypeError('Invalid type parser, expected callback or regex, got ' + (typeof parseType === 'undefined' ? 'undefined' : _typeof(parseType)));
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + (typeof parse === 'undefined' ? 'undefined' : _typeof(parse)));
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + (typeof parseAsync === 'undefined' ? 'undefined' : _typeof(parseAsync)));
  }

  var methodName = parse || parseAsync ? getMethodName(format) : '';

  if (typeof parseType === 'function') {
    addTypeParser(format, parseType);
  } else if (parseType instanceof RegExp) {
    addTypeParser(format, function (input) {
      return typeof input === 'string' && parseType.test(input);
    });
  }

  if (parse) {
    parsers[format] = _[methodName] = parse;
  }

  if (parseAsync) {
    asyncParsers[format] = _[methodName + 'Async'] = parseAsync;
  }
};

var type = function type(input) {
  var result = types.find(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        _ = _ref5[0],
        typeParser = _ref5[1];

    return typeParser(input);
  });

  if (result === undefined) {
    logger.warn('[set]', 'This format is not supported or recognized');
    return '@invalid';
  } else {
    return result[0];
  }
};

var data = function data(input, type) {
  if (parsers.hasOwnProperty(type)) {
    return parsers[type](input);
  } else {
    logger.error('[set]', 'No synchronous parser found for ' + type);
    return [];
  }
};

var dataAsync = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input, type) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!asyncParsers.hasOwnProperty(type)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', asyncParsers[type](input));

          case 4:
            if (!parsers.hasOwnProperty(type)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', data(input, type));

          case 8:
            logger.error('[set]', 'No parser found for ' + type);
            return _context.abrupt('return', []);

          case 10:
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