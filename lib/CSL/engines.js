'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _citeproc = require('citeproc');

var _citeproc2 = _interopRequireDefault(_citeproc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Object containing CSL Engines
 *
 * @access private
 * @constant varCSLEngines
 * @default
 */
var varCSLEngines = {};

/**
 * Retrieve CSL parsing engine
 *
 * @access protected
 * @method fetchCSLEngine
 *
 * @param {String} style - CSL style id
 * @param {String} lang - Language code
 * @param {String} template - CSL XML template
 * @param {Cite~retrieveItem} retrieveItem - Code to retreive item
 * @param {Cite~retrieveLocale} retrieveLocale - Code to retreive locale
 *
 * @return {Object} CSL Engine
 */
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