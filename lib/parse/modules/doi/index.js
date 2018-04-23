"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = void 0;

var id = _interopRequireWildcard(require("./id"));

var api = _interopRequireWildcard(require("./api"));

var json = _interopRequireWildcard(require("./json"));

var type = _interopRequireWildcard(require("./type"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var scope = '@doi';
exports.scope = scope;
var parsers = {
  id: id,
  api: api,
  json: json,
  type: type
};
exports.parsers = parsers;
var types = {
  '@doi/api': {
    dataType: 'String',
    predicate: /^\s*(https?:\/\/(?:dx\.)?doi\.org\/(10.\d{4,9}\/[-._;()/:A-Z0-9]+))\s*$/i
  },
  '@doi/id': {
    dataType: 'String',
    predicate: /^\s*(10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*$/i
  },
  '@doi/list+text': {
    dataType: 'String',
    predicate: /^\s*(?:(?:10.\d{4,9}\/[-._;()/:A-Z0-9]+)\s*)+$/i
  },
  '@doi/list+object': {
    dataType: 'Array',
    elementConstraint: '@doi/id'
  }
};
exports.types = types;