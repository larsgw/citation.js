'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = undefined;

var _json = require('./json');

var json = _interopRequireWildcard(_json);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scope = exports.scope = '@bibjson';
var parsers = exports.parsers = { json: json };
var types = exports.types = {
  '@bibjson/object': {
    dataType: 'SimpleObject',
    propertyConstraint: {
      props: ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'],
      match: 'some',
      value: function value(val) {
        return val && Array.isArray(val.value);
      }
    }
  }
};