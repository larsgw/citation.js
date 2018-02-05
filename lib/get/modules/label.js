"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getLabel = void 0;

var _label = _interopRequireDefault(require("./bibtex/label"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLabel = _label.default;
exports.getLabel = getLabel;
var _default = [{
  name: 'label',
  formatter: function formatter(data) {
    return data.reduce(function (object, entry) {
      object[entry.id] = getLabel(entry);
      return object;
    }, {});
  }
}];
exports.default = _default;