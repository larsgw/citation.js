'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _type = require('./type');

var _data = require('./data');

var _dataType = require('./dataType');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var validate = function validate(format, parsers) {
  if (typeof format !== 'string' || !format.match(_type.typeMatcher)) {
    throw new TypeError('Invalid format name, expected name starting with \'@\'');
  }

  var dataType = parsers.dataType,
      parseType = parsers.parseType,
      propertyConstraint = parsers.propertyConstraint,
      elementConstraint = parsers.elementConstraint,
      parse = parsers.parse,
      parseAsync = parsers.parseAsync;

  if (dataType && typeof dataType !== 'string') {
    throw new TypeError('Invalid data type, expected string, got ' + (0, _dataType.typeOf)(dataType));
  } else if (parseType && typeof parseType !== 'function' && !(parseType instanceof RegExp)) {
    throw new TypeError('Invalid type parser, expected callback or regex, got ' + (0, _dataType.typeOf)(parseType));
  } else if (propertyConstraint && (typeof propertyConstraint === 'undefined' ? 'undefined' : _typeof(propertyConstraint)) !== 'object') {
    throw new TypeError('Invalid property constraint, expected object, got ' + (0, _dataType.typeOf)(propertyConstraint));
  } else if (elementConstraint && typeof elementConstraint !== 'string') {
    throw new TypeError('Invalid element constraint, expected string, got ' + (0, _dataType.typeOf)(elementConstraint));
  } else if (parse && typeof parse !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + (0, _dataType.typeOf)(parse));
  } else if (parseAsync && typeof parseAsync !== 'function') {
    throw new TypeError('Invalid data parser, expected callback, got ' + (0, _dataType.typeOf)(parseAsync));
  }
};

var parsePropertyConstraint = function parsePropertyConstraint(_ref) {
  var _ref$props = _ref.props,
      props = _ref$props === undefined ? [] : _ref$props,
      _ref$match = _ref.match,
      match = _ref$match === undefined ? 'every' : _ref$match,
      value = _ref.value;

  var hasProp = function hasProp(input) {
    return function (prop) {
      return input.hasOwnProperty(prop);
    };
  };
  props = [].concat(props);
  return typeof value === 'function' ? function (input) {
    return props[match](hasProp(input)) && props[match](function (prop) {
      return value(input[prop]);
    });
  } : function (input) {
    return props[match](hasProp(input));
  };
};

var parseElementConstraint = function parseElementConstraint(elementConstraint) {
  return function (input) {
    return input.every(function (entry) {
      return (0, _type.type)(entry) === elementConstraint;
    });
  };
};

var getDataType = function getDataType(_ref2) {
  var dataType = _ref2.dataType,
      parseType = _ref2.parseType;

  return dataType || (parseType instanceof RegExp ? 'String' : 'Primitive');
};

var getParseType = function getParseType(_ref3) {
  var parseType = _ref3.parseType,
      propertyConstraint = _ref3.propertyConstraint,
      elementConstraint = _ref3.elementConstraint;

  var tests = [];

  if (parseType instanceof RegExp) {
    tests.push(parseType.test.bind(parseType));
  } else if (parseType) {
    tests.push(parseType);
  }

  if (propertyConstraint) {
    tests.push.apply(tests, _toConsumableArray([].concat(propertyConstraint).map(parsePropertyConstraint)));
  }
  if (elementConstraint) {
    tests.push(parseElementConstraint(elementConstraint));
  }

  return tests.length === 1 ? tests[0] : function (input) {
    return tests.every(function (test) {
      return test(input);
    });
  };
};

var add = function add(format) {
  var parsers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  validate(format, parsers);

  if (parsers.parseType || parsers.propertyConstraint || parsers.elementConstraint) {
    var dataType = getDataType(parsers);
    var parseType = getParseType(parsers, format);
    (0, _type.addTypeParser)(format, dataType, parseType);
  }

  if (parsers.parse) {
    (0, _data.addDataParser)(format, parsers.parse, { async: false });
  }
  if (parsers.parseAsync) {
    (0, _data.addDataParser)(format, parsers.parseAsync, { async: true });
  }
};

exports.add = add;