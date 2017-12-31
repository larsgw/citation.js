'use strict';

require('babel-polyfill');

require('./logger');

var _static = require('./Cite/static');

var staticMethods = _interopRequireWildcard(_static);

var _index = require('./get/index');

var get = _interopRequireWildcard(_index);

var _index2 = require('./parse/index');

var parse = _interopRequireWildcard(_index2);

var _index3 = require('./util/index');

var util = _interopRequireWildcard(_index3);

var _version = require('./version');

var version = _interopRequireWildcard(_version);

var _index4 = require('./async/index');

var _index5 = _interopRequireDefault(_index4);

var _index6 = require('./Cite/index');

var _index7 = _interopRequireDefault(_index6);

var _locales = require('./get/modules/csl/locales');

var _locales2 = _interopRequireDefault(_locales);

var _styles = require('./get/modules/csl/styles');

var _styles2 = _interopRequireDefault(_styles);

var _engines = require('./get/modules/csl/engines');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var CSL = {
  engine: _engines.fetchEngine,
  style: _styles2.default,
  locale: _locales2.default,
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


Object.assign(_index7.default, staticMethods, {
  async: _index5.default,
  get: get,
  CSL: CSL,
  parse: parse,
  util: util,
  version: version,
  input: parse.input.chain,
  inputAsync: parse.input.async.chain
});

module.exports = _index7.default;