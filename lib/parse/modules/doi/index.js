'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = undefined;

var _id = require('./id');

var id = _interopRequireWildcard(_id);

var _api = require('./api');

var api = _interopRequireWildcard(_api);

var _json = require('./json');

var json = _interopRequireWildcard(_json);

var _type = require('./type');

var type = _interopRequireWildcard(_type);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scope = exports.scope = '@doi';
var parsers = exports.parsers = { id: id, api: api, json: json, type: type };
var types = exports.types = {
  '@doi/api': {
    dataType: 'String',
    parseType: /^\s*(https?:\/\/(?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+))\s*$/i
  },
  '@doi/id': {
    dataType: 'String',
    parseType: /^\s*(10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*$/i
  },
  '@doi/list+text': {
    dataType: 'String',
    parseType: /^\s*(?:(?:10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*)+$/i
  },
  '@doi/list+object': {
    dataType: 'Array',
    elementConstraint: '@doi/id'
  }
};