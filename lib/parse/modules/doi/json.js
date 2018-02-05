"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = exports.types = exports.scope = void 0;

var _type = _interopRequireDefault(require("./type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseDoiJson = function parseDoiJson(data) {
  var res = {
    type: (0, _type.default)(data.type)
  };
  var dateFields = ['submitted', 'issued', 'event-date', 'original-date', 'container', 'accessed'];
  dateFields.forEach(function (field) {
    if (data[field] && typeof data[field]['date-parts'][0] === 'number') {
      data[field]['date-parts'] = [data[field]['date-parts']];
    }
  });
  return Object.assign({}, data, res);
};

exports.default = exports.parse = parseDoiJson;
var scope = '@doi';
exports.scope = scope;
var types = '@doi/object';
exports.types = types;