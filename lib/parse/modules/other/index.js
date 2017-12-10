'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = undefined;

var _empty = require('./empty');

var empty = _interopRequireWildcard(_empty);

var _url = require('./url');

var url = _interopRequireWildcard(_url);

var _json = require('./json');

var json = _interopRequireWildcard(_json);

var _jquery = require('./jquery');

var jquery = _interopRequireWildcard(_jquery);

var _html = require('./html');

var html = _interopRequireWildcard(_html);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scope = exports.scope = '@else';
var parsers = exports.parsers = { empty: empty, url: url, json: json, jquery: jquery, html: html };
var types = exports.types = {
  '@empty/text': {
    dataType: 'String',
    parseType: function parseType(input) {
      return input === '';
    }
  },
  '@empty/whitespace+text': {
    dataType: 'String',
    parseType: /^\s+$/
  },
  '@empty': {
    dataType: 'Primitive',
    parseType: function parseType(input) {
      return input === null || input === undefined;
    }
  },
  '@else/json': {
    dataType: 'String',
    parseType: /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/
  },
  '@else/url': {
    dataType: 'String',
    parseType: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  },
  '@else/jquery': {
    dataType: 'ComplexObject',
    parseType: function parseType(input) {
      return typeof jQuery !== 'undefined' && input instanceof jQuery;
    }
  },
  '@else/html': {
    dataType: 'ComplexObject',
    parseType: function parseType(input) {
      return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
    }
  }
};