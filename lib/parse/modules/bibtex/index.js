"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = void 0;

var text = _interopRequireWildcard(require("./text"));

var json = _interopRequireWildcard(require("./json"));

var prop = _interopRequireWildcard(require("./prop"));

var type = _interopRequireWildcard(require("./type"));

var bibtxt = _interopRequireWildcard(require("./bibtxt"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var scope = '@bibtex';
exports.scope = scope;
var parsers = {
  text: text,
  json: json,
  prop: prop,
  type: type,
  bibtxt: bibtxt
};
exports.parsers = parsers;
var types = {
  '@bibtex/text': {
    dataType: 'String',
    parseType: /^(?:\s*@\s*[^@]+?\s*\{\s*[^@]+?\s*,\s*[^@]+\})+\s*$/
  },
  '@bibtxt/text': {
    dataType: 'String',
    parseType: /^\s*(\[(?!\s*[{[]).*?\]\s*(\n\s*[^[]((?!:)\S)+\s*:\s*.+?\s*)*\s*)+$/
  },
  '@bibtex/object': {
    dataType: 'SimpleObject',
    propertyConstraint: {
      props: ['type', 'label', 'properties']
    }
  }
};
exports.types = types;