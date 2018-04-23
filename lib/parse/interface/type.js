"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeMatcher = exports.hasTypeParser = exports.addTypeParser = exports.type = void 0;

var _dataType = require("./dataType");

var types = {};
var unregExts = {};

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

var matchType = function matchType() {
  var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var data = arguments.length > 1 ? arguments[1] : undefined;

  for (var _type in types) {
    if (types[_type].predicate(data)) {
      return matchType(types[_type].extensions) || _type;
    }
  }
};

var type = function type(input) {
  var dataType = (0, _dataType.dataTypeOf)(input);

  if (!types.hasOwnProperty(dataType)) {
    logger.warn('[set]', 'Data type has no formats listed');
    return parseNativeTypes(input, dataType) || handleInvalidInput(input);
  }

  if (dataType === 'Array' && input.length === 0) {
    return parseNativeTypes(input, dataType);
  }

  var match = matchType(types[dataType], input);
  return match || parseNativeTypes(input, dataType) || handleInvalidInput(input);
};

exports.type = type;

var addTypeParser = function addTypeParser(format, _ref) {
  var dataType = _ref.dataType,
      predicate = _ref.predicate,
      extend = _ref.extends;
  var extensions = {};

  if (format in unregExts) {
    extensions = unregExts[format];
    delete unregExts[format];
    logger.info('[set]', "Subclasses \"".concat(Object.keys(extensions), "\" finally registered to parent type \"").concat(format, "\""));
  }

  var object = {
    predicate: predicate,
    extensions: extensions
  };
  var typeList = types[dataType] || (types[dataType] = {});

  if (extend) {
    var parentTypeParser = typeList[extend];

    if (parentTypeParser) {
      parentTypeParser.extensions[format] = object;
    } else {
      if (!unregExts[extend]) {
        unregExts[extend] = {};
      }

      unregExts[extend][format] = object;
      logger.info('[set]', "Subclass \"".concat(format, "\" is waiting on parent type \"").concat(extend, "\""));
    }
  } else {
    typeList[format] = object;
  }
};

exports.addTypeParser = addTypeParser;

var hasTypeParser = function hasTypeParser(type) {
  return types.hasOwnProperty(type);
};

exports.hasTypeParser = hasTypeParser;
var typeMatcher = /^(?:@(.+?))(?:\/(?:(.+?)\+)?(?:(.+)))?$/;
exports.typeMatcher = typeMatcher;