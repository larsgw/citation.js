"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textDict = exports.htmlDict = exports.get = exports.list = exports.has = exports.remove = exports.add = exports.register = void 0;

var _register = _interopRequireDefault(require("../util/register"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var validate = function validate(name, dict) {
  if (typeof name !== 'string') {
    throw new TypeError("Invalid dict name, expected string, got ".concat(_typeof(name)));
  } else if (_typeof(dict) !== 'object') {
    throw new TypeError("Invalid dict, expected object, got ".concat(_typeof(dict)));
  }

  for (var entryName in dict) {
    var entry = dict[entryName];

    if (!Array.isArray(entry) || entry.some(function (part) {
      return typeof part !== 'string';
    })) {
      throw new TypeError("Invalid dict entry \"".concat(entryName, "\", expected array of strings"));
    }
  }
};

var register = new _register.default({
  html: {
    bibliographyContainer: ['<div class="csl-bib-body>', '</div>'],
    entry: ['<div class="csl-entry>', '</div>'],
    list: ['<ul style="list-style-type:none">', '</ul>'],
    listItem: ['<li>', '</li>']
  },
  text: {
    bibliographyContainer: ['', '\n'],
    entry: ['', '\n'],
    list: ['\n', ''],
    listItem: ['\t', '\n']
  }
});
exports.register = register;

var add = function add(name, dict) {
  validate(name, dict);
  register.set(name, dict);
};

exports.add = add;

var remove = function remove(name) {
  register.remove(name);
};

exports.remove = remove;

var has = function has(name) {
  return register.has(name);
};

exports.has = has;

var list = function list() {
  return register.list();
};

exports.list = list;

var get = function get(name) {
  if (!register.has(name)) {
    logger.error('[get]', "Dict \"".concat(name, "\" unavailable"));
    return undefined;
  }

  return register.get(name);
};

exports.get = get;
var htmlDict = {
  wr_start: '<div class="csl-bib-body">',
  wr_end: '</div>',
  en_start: '<div class="csl-entry">',
  en_end: '</div>',
  ul_start: '<ul style="list-style-type:none">',
  ul_end: '</ul>',
  li_start: '<li>',
  li_end: '</li>'
};
exports.htmlDict = htmlDict;
var textDict = {
  wr_start: '',
  wr_end: '\n',
  en_start: '',
  en_end: '\n',
  ul_start: '\n',
  ul_end: '',
  li_start: '\t',
  li_end: '\n'
};
exports.textDict = textDict;