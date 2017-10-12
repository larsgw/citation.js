'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = {};
var parsers = {};
var asyncParsers = {};
var _ = {};

var typeOf = function typeOf(thing) {
  return thing === undefined ? 'Undefined' : thing === null ? 'Null' : thing.constructor.name;
};
var dataTypeOf = function dataTypeOf(thing) {
  switch (typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) {
    case 'string':
      return 'String';

    case 'object':
      if (Array.isArray(thing)) {
        return 'Array';
      } else if (typeOf(thing) === 'Object') {
        return 'SimpleObject';
      } else if (typeOf(thing) !== 'Null') {
        return 'ComplexObject';
      }
    // falls through when thing === null, returns default

    default:
      return 'Primitive';
  }
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

var addTypeParser = function addTypeParser(format, dataType, parseType) {
  var typeList = types[dataType] || (types[dataType] = {});
  typeList[format] = parseType;
};

var add = function add(format) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      dataType = _ref.dataType,
      parseType = _ref.parseType,
      parse = _ref.parse,
      parseAsync = _ref.parseAsync;

  if (typeof format !== 'string' || !format.match(typeMatcher)) {
    throw new TypeError('Invalid format name, expected name starting with \'@\'');
  } else if (dataType && typeof dataType !== 'string') {
    throw new TypeError('Invalid data type, expected string, got ' + typeOf(dataType));
  } else if (parseType && typeof parseType !== 'function' && !(parseType instanceof RegExp)) {
    throw new TypeError('Invalid type parser, expected callback or regex, got ' + typeOf(parseType));
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + typeOf(parse));
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + typeOf(parseAsync));
  }

  //   const input = [+(typeof parseType === 'function' || parseType instanceof RegExp), +!!parse, +!!parseAsync]
  //   logger.log(format.padEnd(25), ...input)
  //   if (input.every(n=>n===0)) {
  //     logger.log(arguments[1])
  //   }

  var methodName = parse || parseAsync ? getMethodName(format) : '';

  if (parseType) {
    if (parseType instanceof RegExp) {
      dataType = dataType || 'String';
      parseType = parseType.test.bind(parseType);
    }
    addTypeParser(format, dataType, parseType);
  }

  if (parse) {
    parsers[format] = _[methodName] = parse;
  }

  if (parseAsync) {
    asyncParsers[format] = _[methodName + 'Async'] = parseAsync;
  }
};

var parseNativeTypes = function parseNativeTypes(input, dataType) {
  switch (dataType) {
    case 'Array':
      if (input.length === 0 || input.every(function (entry) {
        return type(entry) === '@csl/object';
      })) {
        return '@csl/list+object';
      } else {
        return '@else/list+object';
      }

    case 'SimpleObject':
    case 'ComplexObject':
      // might, of course, be something completely else, but we're gonna parse it as CSL dammit!
      return '@csl/object';
  }
};

var handleInvalidInput = function handleInvalidInput() {
  logger.warn('[set]', 'This format is not supported or recognized');
  return '@invalid';
};

var type = function type(input) {
  var dataType = dataTypeOf(input);

  if (!types.hasOwnProperty(dataType)) {
    logger.warn('[set]', 'Data type has no formats listed');
    return handleInvalidInput(input);
  }

  // Empty array should be @csl/list+object too
  if (dataType === 'Array' && input.length === 0) {
    // Off-loading to parseNativeTypes to not repeat the name
    // '@csl/list+object' here as well, as it might change
    return parseNativeTypes(input, dataType);
  }

  var matches = Object.entries(types[dataType]).filter(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        parse = _ref3[1];

    return parse(input);
  }).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 1),
        format = _ref5[0];

    return format;
  });

  if (matches.length === 0) {
    // No matching formats found, testing if native format,
    // eles invalid input.
    return parseNativeTypes(input, dataType) || handleInvalidInput(input);
  } else {
    return matches[0];
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