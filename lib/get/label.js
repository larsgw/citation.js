'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _label = require('./bibtex/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getLabel = function getLabel(src) {
  return (0, _label2.default)(src);
};

exports.default = getLabel;