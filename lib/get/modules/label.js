'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabel = undefined;

var _label = require('./bibtex/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLabel = _label2.default;

exports.getLabel = getLabel;
exports.default = [{
  name: 'label',
  formatter: function formatter(data) {
    return data.reduce(function (object, entry) {
      object[entry.id] = getLabel(entry);
    }, {});
  }
}];