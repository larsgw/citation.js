'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dict = require('../../dict');

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

var _text = require('./text');

var _bibtxt = require('./bibtxt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var factory = function factory(formatter) {
  return function (data) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'text' : _ref$type;

    if (type === 'object') {
      return data.map(_json2.default);
    } else {
      return (0, _dict.has)(type) ? formatter(data, (0, _dict.get)(type)) : '';
    }
  };
};

exports.default = [{ name: 'bibtex', formatter: factory(_text.getBibtex) }, { name: 'bibtxt', formatter: factory(_bibtxt.getBibtxt) }];