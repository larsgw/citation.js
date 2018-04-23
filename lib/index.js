"use strict";

require("@babel/polyfill");

require("./logger");

var staticMethods = _interopRequireWildcard(require("./Cite/static"));

var get = _interopRequireWildcard(require("./get/index"));

var parse = _interopRequireWildcard(require("./parse/index"));

var util = _interopRequireWildcard(require("./util/index"));

var version = _interopRequireWildcard(require("./version"));

var _index4 = _interopRequireDefault(require("./async/index"));

var _index5 = _interopRequireDefault(require("./Cite/index"));

var _locales = _interopRequireWildcard(require("./get/modules/csl/locales"));

var _styles = _interopRequireWildcard(require("./get/modules/csl/styles"));

var _engines = require("./get/modules/csl/engines");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var CSL = {
  engine: _engines.fetchEngine,
  style: _styles.default,
  locale: _locales.default,
  item: function item(data) {
    return function (id) {
      return data.find(function (entry) {
        return entry.id === id;
      });
    };
  },
  register: {
    addTemplate: _styles.templates.add.bind(_styles.templates),
    getTemplate: _styles.templates.get.bind(_styles.templates),
    hasTemplate: _styles.templates.has.bind(_styles.templates),
    addLocale: _locales.locales.add.bind(_locales.locales),
    getLocale: _locales.locales.get.bind(_locales.locales),
    hasLocale: _locales.locales.has.bind(_locales.locales)
  }
};
Object.assign(_index5.default, staticMethods, {
  async: _index4.default,
  get: get,
  CSL: CSL,
  parse: parse,
  util: util,
  version: version,
  input: parse.chain,
  inputAsync: parse.chainAsync
});
module.exports = _index5.default;