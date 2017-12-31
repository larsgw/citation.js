'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textDict = exports.htmlDict = exports.get = exports.list = exports.has = exports.remove = exports.add = exports.register = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _register = require('../util/register');

var _register2 = _interopRequireDefault(_register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validate = function validate(name, dict) {
  if (typeof name !== 'string') {
    throw new TypeError('Invalid dict name, expected string, got ' + (typeof name === 'undefined' ? 'undefined' : _typeof(name)));
  } else if ((typeof dict === 'undefined' ? 'undefined' : _typeof(dict)) !== 'object') {
    throw new TypeError('Invalid dict, expected object, got ' + (typeof dict === 'undefined' ? 'undefined' : _typeof(dict)));
  }

  for (var entryName in dict) {
    var entry = dict[entryName];
    if (!Array.isArray(entry) || entry.some(function (part) {
      return typeof part !== 'string';
    })) {
      throw new TypeError('Invalid dict entry "' + entryName + '", expected array of strings');
    }
  }
};

var register = exports.register = new _register2.default({
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

var add = exports.add = function add(name, dict) {
  validate(name, dict);
  register.set(name, dict);
};

var remove = exports.remove = function remove(name) {
  register.remove(name);
};

var has = exports.has = function has(name) {
  return register.has(name);
};

var list = exports.list = function list() {
  return register.list();
};

var get = exports.get = function get(name) {
  if (!register.has(name)) {
    logger.error('[get]', 'Dict "' + name + '" unavailable');
    return undefined;
  }
  return register.get(name);
};

var htmlDict = exports.htmlDict = {
  wr_start: '<div class="csl-bib-body">',
  wr_end: '</div>',
  en_start: '<div class="csl-entry">',
  en_end: '</div>',
  ul_start: '<ul style="list-style-type:none">',
  ul_end: '</ul>',
  li_start: '<li>',
  li_end: '</li>'
};

var textDict = exports.textDict = {
  wr_start: '',
  wr_end: '\n',
  en_start: '',
  en_end: '\n',
  ul_start: '\n',
  ul_end: '',
  li_start: '\t',
  li_end: '\n'
};