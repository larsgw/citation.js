'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

var _fetchFileAsync = require('../../../util/fetchFileAsync');

var _fetchFileAsync2 = _interopRequireDefault(_fetchFileAsync);

var _prop = require('../prop');

var _prop2 = _interopRequireDefault(_prop);

var _name = require('../../name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Get the names of objects from Wikidata IDs (async)
 *
 * @access private
 * @method fetchWikidataLabelAsync
 *
 * @param {String|Array<String>} q - Wikidata IDs
 * @param {String} lang - Language
 *
 * @return {Array<String>} Array with labels of each prop
 */
var fetchWikidataLabelAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(q, lang) {
    var ids, url, entities;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ids = Array.isArray(q) ? q : typeof q === 'string' ? q.split('|') : '';
            url = _wikidataSdk2.default.getEntities(ids, [lang], 'labels');
            _context.t1 = JSON;
            _context.next = 5;
            return (0, _fetchFileAsync2.default)(url);

          case 5:
            _context.t2 = _context.sent;
            _context.t0 = _context.t1.parse.call(_context.t1, _context.t2).entities;

            if (_context.t0) {
              _context.next = 9;
              break;
            }

            _context.t0 = {};

          case 9:
            entities = _context.t0;
            return _context.abrupt('return', Object.keys(entities).map(function (entityKey) {
              return (entities[entityKey].labels[lang] || {}).value;
            }));

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchWikidataLabelAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var parseWikidataP1545 = function parseWikidataP1545(qualifiers) {
  return qualifiers.P1545 ? parseInt(qualifiers.P1545[0]) : -1;
};

/**
 * Transform property and value from Wikidata format to CSL (async).
 *
 * Returns additional _ordinal property on authors.
 *
 * @access protected
 * @method parseWikidataPropAsync
 *
 * @param {String} prop - Property
 * @param {String|Number} value - Value
 * @param {String} lang - Language
 *
 * @return {Array<String>} Array with new prop and value
 */
var parseWikidataPropAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(prop, value, lang) {
    var _this = this;

    var cslValue;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(prop, valueList) {
                var value;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        value = valueList[0].value;
                        _context3.t0 = prop;
                        _context3.next = _context3.t0 === 'P50' ? 4 : _context3.t0 === 'P57' ? 4 : _context3.t0 === 'P86' ? 4 : _context3.t0 === 'P98' ? 4 : _context3.t0 === 'P110' ? 4 : _context3.t0 === 'P655' ? 4 : _context3.t0 === 'P123' ? 5 : _context3.t0 === 'P136' ? 5 : _context3.t0 === 'P291' ? 5 : _context3.t0 === 'P1433' ? 5 : 8;
                        break;

                      case 4:
                        return _context3.abrupt('return', Promise.all(valueList.map(function () {
                          var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref4) {
                            var value = _ref4.value,
                                qualifiers = _ref4.qualifiers;
                            var name;
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.t0 = _name2.default;
                                    _context2.next = 3;
                                    return fetchWikidataLabelAsync(value, lang);

                                  case 3:
                                    _context2.t1 = _context2.sent[0];
                                    name = (0, _context2.t0)(_context2.t1);

                                    name._ordinal = parseWikidataP1545(qualifiers);
                                    return _context2.abrupt('return', name);

                                  case 7:
                                  case 'end':
                                    return _context2.stop();
                                }
                              }
                            }, _callee2, _this);
                          }));

                          return function (_x8) {
                            return _ref5.apply(this, arguments);
                          };
                        }())));

                      case 5:
                        _context3.next = 7;
                        return fetchWikidataLabelAsync(value, lang);

                      case 7:
                        return _context3.abrupt('return', _context3.sent[0]);

                      case 8:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x6, _x7) {
                return _ref3.apply(this, arguments);
              };
            }()(prop, value);

          case 2:
            cslValue = _context4.sent;

            if (!cslValue) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt('return', [(0, _prop2.default)(prop), cslValue]);

          case 7:
            return _context4.abrupt('return', (0, _prop2.default)(prop, value, lang));

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function parseWikidataPropAsync(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.default = parseWikidataPropAsync;