"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dict = require("../../dict");

var _json = _interopRequireDefault(require("./json"));

var _text = require("./text");

var _bibtxt = require("./bibtxt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var factory = function factory(formatter) {
  return function (data) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? 'text' : _ref$type;

    if (type === 'object') {
      return data.map(_json.default);
    } else {
      return (0, _dict.has)(type) ? formatter(data, (0, _dict.get)(type)) : '';
    }
  };
};

var _default = [{
  name: 'bibtex',
  formatter: factory(_text.getBibtex)
}, {
  name: 'bibtxt',
  formatter: factory(_bibtxt.getBibtxt)
}];
exports.default = _default;