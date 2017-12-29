'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dict = exports.name = exports.date = exports.label = exports.json = exports.bibtxt = exports.bibtex = undefined;

var _registrar = require('./registrar');

Object.keys(_registrar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _registrar[key];
    }
  });
});

var _dict = require('./dict');

var dict = _interopRequireWildcard(_dict);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

require('./modules/');

var _json = require('./modules/bibtex/json');

var _json2 = _interopRequireDefault(_json);

var _label = require('./modules/bibtex/label');

var _label2 = _interopRequireDefault(_label);

var _text = require('./modules/bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _type = require('./modules/bibtex/type');

var _type2 = _interopRequireDefault(_type);

var _bibtxt = require('./modules/bibtex/bibtxt');

var _bibtxt2 = _interopRequireDefault(_bibtxt);

var _json3 = require('./modules/json');

var _label3 = require('./modules/label');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var bibtex = exports.bibtex = {
  json: _json2.default,
  label: _label2.default,
  text: _text2.default,
  type: _type2.default
};
exports.bibtxt = _bibtxt2.default;
exports.json = _json3.getJsonWrapper;
exports.label = _label3.getLabel;
exports.date = _date2.default;
exports.name = _name2.default;
exports.dict = dict;