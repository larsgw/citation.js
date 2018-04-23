"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormatParser = exports.DataParser = exports.TypeParser = void 0;

var _type = require("./type");

var _data = require("./data");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TypeParser = function () {
  function TypeParser(data) {
    _classCallCheck(this, TypeParser);

    Object.defineProperty(this, "validDataTypes", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: ['String', 'Array', 'SimpleObject', 'ComplexObject', 'Primitive']
    });
    this.data = data;
  }

  _createClass(TypeParser, [{
    key: "validateDataType",
    value: function validateDataType() {
      var dataType = this.data.dataType;

      if (dataType && !this.validDataTypes.includes(dataType)) {
        throw new RangeError("dataType was ".concat(dataType, "; expected one of ").concat(this.validDataTypes));
      }
    }
  }, {
    key: "validateParseType",
    value: function validateParseType() {
      var predicate = this.data.predicate;

      if (predicate && !(predicate instanceof RegExp || typeof predicate === 'function')) {
        throw new TypeError("predicate was ".concat(_typeof(predicate), "; expected RegExp or function"));
      }
    }
  }, {
    key: "validatePropertyConstraint",
    value: function validatePropertyConstraint() {
      var propertyConstraint = this.data.propertyConstraint;

      if (propertyConstraint && _typeof(propertyConstraint) !== 'object') {
        throw new TypeError("propertyConstraint was ".concat(_typeof(propertyConstraint), "; expected array or object"));
      }
    }
  }, {
    key: "validateElementConstraint",
    value: function validateElementConstraint() {
      var elementConstraint = this.data.elementConstraint;

      if (elementConstraint && typeof elementConstraint !== 'string') {
        throw new TypeError("elementConstraint was ".concat(_typeof(elementConstraint), "; expected string"));
      }
    }
  }, {
    key: "validateExtends",
    value: function validateExtends() {
      var extend = this.data.extends;

      if (extend && typeof extend !== 'string') {
        throw new TypeError("extends was ".concat(_typeof(extend), "; expected string"));
      }
    }
  }, {
    key: "validate",
    value: function validate() {
      this.validateDataType();
      this.validateParseType();
      this.validatePropertyConstraint();
      this.validateElementConstraint();
      this.validateExtends();
    }
  }, {
    key: "parsePropertyConstraint",
    value: function parsePropertyConstraint() {
      var constraints = [].concat(this.data.propertyConstraint || []);
      return constraints.map(function (_ref) {
        var _ref$props = _ref.props,
            props = _ref$props === void 0 ? [] : _ref$props,
            _ref$match = _ref.match,
            match = _ref$match === void 0 ? 'every' : _ref$match,
            _ref$value = _ref.value,
            value = _ref$value === void 0 ? function () {
          return true;
        } : _ref$value;
        props = [].concat(props);
        return function (input) {
          return props[match](function (prop) {
            return prop in input && value(input[prop]);
          });
        };
      });
    }
  }, {
    key: "parseElementConstraint",
    value: function parseElementConstraint() {
      var constraint = this.data.elementConstraint;
      return !constraint ? [] : [function (input) {
        return input.every(function (entry) {
          return (0, _type.type)(entry) === constraint;
        });
      }];
    }
  }, {
    key: "parsePredicate",
    value: function parsePredicate() {
      if (this.data.predicate instanceof RegExp) {
        return [this.data.predicate.test.bind(this.data.predicate)];
      } else if (this.data.predicate) {
        return [this.data.predicate];
      } else {
        return [];
      }
    }
  }, {
    key: "getCombinedPredicate",
    value: function getCombinedPredicate() {
      var predicates = _toConsumableArray(this.parsePredicate()).concat(_toConsumableArray(this.parsePropertyConstraint()), _toConsumableArray(this.parseElementConstraint()));

      if (predicates.length === 0) {
        return function () {
          return true;
        };
      } else if (predicates.length === 1) {
        return predicates[0];
      } else {
        return function (input) {
          return predicates.every(function (predicate) {
            return predicate(input);
          });
        };
      }
    }
  }, {
    key: "getDataType",
    value: function getDataType() {
      if (this.data.dataType) {
        return this.data.dataType;
      } else if (this.data.predicate instanceof RegExp) {
        return 'String';
      } else if (this.data.elementConstraint) {
        return 'Array';
      } else {
        return 'Primitive';
      }
    }
  }, {
    key: "dataType",
    get: function get() {
      return this.getDataType();
    }
  }, {
    key: "predicate",
    get: function get() {
      return this.getCombinedPredicate();
    }
  }, {
    key: "extends",
    get: function get() {
      return this.data.extends;
    }
  }]);

  return TypeParser;
}();

exports.TypeParser = TypeParser;

var DataParser = function () {
  function DataParser(parser) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        async = _ref2.async;

    _classCallCheck(this, DataParser);

    this.parser = parser;
    this.async = async;
  }

  _createClass(DataParser, [{
    key: "validate",
    value: function validate() {
      var parser = this.parser;

      if (parser && typeof parser !== 'function') {
        throw new TypeError("parser was ".concat(_typeof(parser), "; expected function"));
      }
    }
  }]);

  return DataParser;
}();

exports.DataParser = DataParser;

var FormatParser = function () {
  function FormatParser(format, parsers) {
    _classCallCheck(this, FormatParser);

    this.format = format;

    if (parsers.parseType) {
      this.typeParser = new TypeParser(parsers.parseType);
    }

    if (parsers.parse) {
      this.dataParser = new DataParser(parsers.parse, {
        async: false
      });
    }

    if (parsers.parseAsync) {
      this.dataAsyncParser = new DataParser(parsers.parseAsync, {
        async: true
      });
    }
  }

  _createClass(FormatParser, [{
    key: "validateFormat",
    value: function validateFormat() {
      var format = this.format;

      if (!_type.typeMatcher.test(format)) {
        throw new TypeError("format name was \"".concat(format, "\"; didn't match expected pattern"));
      }
    }
  }, {
    key: "validate",
    value: function validate() {
      this.validateFormat();

      if (this.typeParser) {
        this.typeParser.validate();
      }

      if (this.dataParser) {
        this.dataParser.validate();
      }

      if (this.dataAsyncParser) {
        this.dataAsyncParser.validate();
      }
    }
  }, {
    key: "add",
    value: function add() {
      var format = this.format;

      if (this.typeParser) {
        (0, _type.addTypeParser)(format, this.typeParser);
      }

      if (this.dataParser) {
        (0, _data.addDataParser)(format, this.dataParser);
      }

      if (this.dataAsyncParser) {
        (0, _data.addDataParser)(format, this.dataAsyncParser);
      }
    }
  }]);

  return FormatParser;
}();

exports.FormatParser = FormatParser;