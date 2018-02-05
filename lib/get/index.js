"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  bibtex: true,
  dict: true,
  date: true,
  name: true,
  bibtxt: true,
  json: true,
  label: true
};
Object.defineProperty(exports, "date", {
  enumerable: true,
  get: function get() {
    return _date.default;
  }
});
Object.defineProperty(exports, "name", {
  enumerable: true,
  get: function get() {
    return _name.default;
  }
});
Object.defineProperty(exports, "bibtxt", {
  enumerable: true,
  get: function get() {
    return _bibtxt.default;
  }
});
Object.defineProperty(exports, "json", {
  enumerable: true,
  get: function get() {
    return _json2.getJsonWrapper;
  }
});
Object.defineProperty(exports, "label", {
  enumerable: true,
  get: function get() {
    return _label2.getLabel;
  }
});
exports.dict = exports.bibtex = void 0;

var dict = _interopRequireWildcard(require("./dict"));

exports.dict = dict;

var _date = _interopRequireDefault(require("./date"));

var _name = _interopRequireDefault(require("./name"));

require("./modules/");

var _json = _interopRequireDefault(require("./modules/bibtex/json"));

var _label = _interopRequireDefault(require("./modules/bibtex/label"));

var _text = _interopRequireDefault(require("./modules/bibtex/text"));

var _type = _interopRequireDefault(require("./modules/bibtex/type"));

var _bibtxt = _interopRequireDefault(require("./modules/bibtex/bibtxt"));

var _json2 = require("./modules/json");

var _label2 = require("./modules/label");

var _registrar = require("./registrar");

Object.keys(_registrar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _registrar[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var bibtex = {
  json: _json.default,
  label: _label.default,
  text: _text.default,
  type: _type.default
};
exports.bibtex = bibtex;