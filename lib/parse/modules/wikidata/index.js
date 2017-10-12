'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = undefined;

var _list = require('./list');

var list = _interopRequireWildcard(_list);

var _json = require('./json');

var json = _interopRequireWildcard(_json);

var _prop = require('./prop');

var prop = _interopRequireWildcard(_prop);

var _type = require('./type');

var type = _interopRequireWildcard(_type);

var _register = require('../../register');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scope = exports.scope = '@wikidata';
var parsers = exports.parsers = { list: list, json: json, prop: prop, type: type };
var types = exports.types = {
  '@wikidata/id': {
    dataType: 'String',
    parseType: /^\s*(Q\d+)\s*$/
  },
  '@wikidata/list+text': {
    dataType: 'String',
    parseType: /^\s*((?:Q\d+(?:\s+|,|))*Q\d+)\s*$/
  },
  '@wikidata/api': {
    dataType: 'String',
    parseType: /^(https?:\/\/(?:www\.)?wikidata.org\/w\/api\.php(?:\?.*)?)$/
  },
  '@wikidata/url': {
    dataType: 'String',
    parseType: /\/(Q\d+)(?:[#?/]|\s*$)/
  },
  '@wikidata/array': {
    dataType: 'Array',
    parseType: function parseType(input) {
      return input.every(function (v) {
        return (0, _register.type)(v) === '@wikidata/id';
      });
    }
  },
  '@wikidata/object': {
    dataType: 'SimpleObject',
    parseType: function parseType(input) {
      return input && input.hasOwnProperty('entities');
    }
  }
};