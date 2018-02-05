"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = void 0;

var list = _interopRequireWildcard(require("./list"));

var json = _interopRequireWildcard(require("./json"));

var prop = _interopRequireWildcard(require("./prop"));

var type = _interopRequireWildcard(require("./type"));

var url = _interopRequireWildcard(require("./url"));

var api = _interopRequireWildcard(require("./api"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var scope = '@wikidata';
exports.scope = scope;
var parsers = {
  list: list,
  json: json,
  prop: prop,
  type: type,
  url: url,
  api: api
};
exports.parsers = parsers;
var types = {
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
    elementConstraint: '@wikidata/id'
  },
  '@wikidata/object': {
    dataType: 'SimpleObject',
    propertyConstraint: {
      props: 'entities'
    }
  }
};
exports.types = types;