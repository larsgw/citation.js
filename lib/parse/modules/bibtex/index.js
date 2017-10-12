'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = undefined;

var _text = require('./text');

var text = _interopRequireWildcard(_text);

var _json = require('./json');

var json = _interopRequireWildcard(_json);

var _prop = require('./prop');

var prop = _interopRequireWildcard(_prop);

var _type = require('./type');

var type = _interopRequireWildcard(_type);

var _bibtxt = require('./bibtxt');

var bibtxt = _interopRequireWildcard(_bibtxt);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scope = exports.scope = '@bibtex';
var parsers = exports.parsers = { text: text, json: json, prop: prop, type: type, bibtxt: bibtxt };
var types = exports.types = {
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
    parseType: function parseType(input) {
      return input && ['type', 'label', 'properties'].every(function (prop) {
        return input.hasOwnProperty(prop);
      });
    }
  }
};