"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEngine = exports.default = void 0;

var _citeproc = _interopRequireDefault(require("citeproc"));

var _styles = _interopRequireDefault(require("./styles"));

var _locales = require("./locales");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var engines = {};

var fetchEngine = function fetchEngine(style, lang, template, retrieveItem, retrieveLocale) {
  var engineHash = "".concat(style, "|").concat(lang);
  var engine;

  if (engines.hasOwnProperty(engineHash)) {
    engine = engines[engineHash];
    engine.sys.retrieveItem = retrieveItem;
  } else {
    engine = engines[engineHash] = new _citeproc.default.Engine({
      retrieveLocale: retrieveLocale,
      retrieveItem: retrieveItem
    }, template, lang, true);
  }

  return engine;
};

exports.fetchEngine = fetchEngine;

var prepareEngine = function prepareEngine(data, templateName, language, format) {
  var items = data.reduce(function (store, entry) {
    store[entry.id] = entry;
    return store;
  }, {});
  var template = (0, _styles.default)(templateName);
  language = _locales.locales.has(language) ? language : 'en-US';
  var engine = fetchEngine(templateName, language, template, function (key) {
    return items[key];
  }, _locales.locales.get.bind(_locales.locales));
  engine.setOutputFormat(format);
  return engine;
};

var _default = prepareEngine;
exports.default = _default;