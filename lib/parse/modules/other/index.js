"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = void 0;

var empty = _interopRequireWildcard(require("./empty"));

var url = _interopRequireWildcard(require("./url"));

var json = _interopRequireWildcard(require("./json"));

var jquery = _interopRequireWildcard(require("./jquery"));

var html = _interopRequireWildcard(require("./html"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var scope = '@else';
exports.scope = scope;
var parsers = {
  empty: empty,
  url: url,
  json: json,
  jquery: jquery,
  html: html
};
exports.parsers = parsers;
var types = {
  '@empty/text': {
    dataType: 'String',
    predicate: function predicate(input) {
      return input === '';
    }
  },
  '@empty/whitespace+text': {
    dataType: 'String',
    predicate: /^\s+$/
  },
  '@empty': {
    dataType: 'Primitive',
    predicate: function predicate(input) {
      return input == null;
    }
  },
  '@else/json': {
    dataType: 'String',
    predicate: /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/
  },
  '@else/url': {
    dataType: 'String',
    predicate: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  },
  '@else/jquery': {
    dataType: 'ComplexObject',
    predicate: function predicate(input) {
      return typeof jQuery !== 'undefined' && input instanceof jQuery;
    }
  },
  '@else/html': {
    dataType: 'ComplexObject',
    predicate: function predicate(input) {
      return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
    }
  }
};
exports.types = types;