'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEngine = undefined;

var _citeproc = require('citeproc');

var _citeproc2 = _interopRequireDefault(_citeproc);

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

var _locales = require('./locales');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var engines = {};

var fetchEngine = function fetchEngine(style, lang, template, retrieveItem, retrieveLocale) {
  var engineHash = style + '|' + lang;
  var engine = void 0;

  if (engines.hasOwnProperty(engineHash)) {
    engine = engines[engineHash];
    engine.sys.retrieveItem = retrieveItem;
  } else {
    engine = engines[engineHash] = new _citeproc2.default.Engine({ retrieveLocale: retrieveLocale, retrieveItem: retrieveItem }, template, lang, true);
  }

  return engine;
};

var prepareEngine = function prepareEngine(data, templateName, language, format) {
  var items = data.reduce(function (store, entry) {
    store[entry.id] = entry;return store;
  }, {});
  var template = (0, _styles2.default)(templateName);
  language = _locales.locales.has(language) ? language : 'en-US';

  var engine = fetchEngine(templateName, language, template, function (key) {
    return items[key];
  }, _locales.locales.get.bind(_locales.locales));
  engine.setOutputFormat(format);

  return engine;
};

exports.default = prepareEngine;
exports.fetchEngine = fetchEngine;