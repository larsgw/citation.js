"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.parsers = exports.scope = void 0;

var json = _interopRequireWildcard(require("./json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var scope = '@bibjson';
exports.scope = scope;
var parsers = {
  json: json
};
exports.parsers = parsers;
var types = {
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
exports.types = types;