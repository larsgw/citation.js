'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _citeproc = require('citeproc');

var _citeproc2 = _interopRequireDefault(_citeproc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var varCSLEngines = {};

var fetchCSLEngine = function fetchCSLEngine(style, lang, template, retrieveItem, retrieveLocale) {
  var prop = style + '|' + lang;
  var engine = void 0;

  if (varCSLEngines.hasOwnProperty(prop)) {
    engine = varCSLEngines[prop];
    engine.sys.retrieveItem = retrieveItem;
  } else {
    engine = varCSLEngines[prop] = new _citeproc2.default.Engine({ retrieveLocale: retrieveLocale, retrieveItem: retrieveItem }, template, lang, true);
  }

  return engine;
};

exports.default = fetchCSLEngine;