'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = undefined;

var _json = require('./json');

var bibjson = _interopRequireWildcard(_json);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scope = exports.scope = '@bibjson';
var parsers = exports.parsers = { bibjson: bibjson };
var types = exports.types = {
  '@bibjson/object': {
    dataType: 'SimpleObject',
    parseType: function parseType(input) {
      return ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'].some(function (prop) {
        return input[prop] && Array.isArray(input[prop].value);
      });
    }
  }
};