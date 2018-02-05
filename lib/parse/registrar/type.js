"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeMatcher = exports.hasTypeParser = exports.addTypeParser = exports.type = void 0;

var _dataType = require("./dataType");

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var types = {};

var handleInvalidInput = function handleInvalidInput() {
  logger.warn('[set]', 'This format is not supported or recognized');
  return '@invalid';
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
      return '@csl/object';
  }
};

var type = function type(input) {
  var dataType = (0, _dataType.dataTypeOf)(input);

  if (!types.hasOwnProperty(dataType)) {
    logger.warn('[set]', 'Data type has no formats listed');
    return handleInvalidInput(input);
  }

  if (dataType === 'Array' && input.length === 0) {
    return parseNativeTypes(input, dataType);
  }

  var matches = Object.entries(types[dataType]).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        parse = _ref2[1];

    return parse(input);
  }).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        format = _ref4[0];

    return format;
  });

  if (matches.length === 0) {
    return parseNativeTypes(input, dataType) || handleInvalidInput(input);
  } else {
    return matches[0];
  }
};

exports.type = type;

var addTypeParser = function addTypeParser(format, dataType, parseType) {
  var typeList = types[dataType] || (types[dataType] = {});
  typeList[format] = parseType;
};

exports.addTypeParser = addTypeParser;

var hasTypeParser = function hasTypeParser(type) {
  return types.hasOwnProperty(type);
};

exports.hasTypeParser = hasTypeParser;
var typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/;
exports.typeMatcher = typeMatcher;