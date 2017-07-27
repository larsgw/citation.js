'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

var _fetchFileAsync = require('../../../util/fetchFileAsync');

var _fetchFileAsync2 = _interopRequireDefault(_fetchFileAsync);

var _type = require('../type');

var _type2 = _interopRequireDefault(_type);

var _date = require('../../date');

var _date2 = _interopRequireDefault(_date);

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
 * @param {String|String[]} q - Wikidata IDs
 * @param {String} lang - Language
 *
 * @return {String[]} Array with labels of each prop
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
 * Transform property and value from Wikidata format to CSL (async)
 *
 * @access protected
 * @method parseWikidataPropAsync
 *
 * @param {String} prop - Property
 * @param {String|Number} value - Value
 * @param {String} lang - Language
 *
 * @return {String[]} Array with new prop and value
 */
var parseWikidataPropAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(prop, value, lang) {
    var rProp, rValue;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = prop;
            _context3.next = _context3.t0 === 'P50' ? 3 : _context3.t0 === 'P2093' ? 3 : 5;
            break;

          case 3:
            value = value.slice();
            return _context3.abrupt('break', 7);

          case 5:
            value = value.length ? value[0].value : undefined;
            return _context3.abrupt('break', 7);

          case 7:
            rProp = '';
            rValue = value;
            _context3.t1 = prop;
            _context3.next = _context3.t1 === 'P50' ? 12 : _context3.t1 === 'P2093' ? 17 : _context3.t1 === 'P580' ? 20 : _context3.t1 === 'P585' ? 20 : _context3.t1 === 'P356' ? 23 : _context3.t1 === 'P31' ? 25 : _context3.t1 === 'P212' ? 29 : _context3.t1 === 'P957' ? 29 : _context3.t1 === 'P433' ? 31 : _context3.t1 === 'P1433' ? 33 : _context3.t1 === 'P304' ? 38 : _context3.t1 === 'P393' ? 40 : _context3.t1 === 'P577' ? 42 : _context3.t1 === 'P1476' ? 45 : _context3.t1 === 'P953' ? 47 : _context3.t1 === 'P478' ? 49 : _context3.t1 === 'P2860' ? 51 : _context3.t1 === 'P921' ? 51 : _context3.t1 === 'P3181' ? 51 : _context3.t1 === 'P364' ? 51 : _context3.t1 === 'P698' ? 51 : _context3.t1 === 'P932' ? 51 : _context3.t1 === 'P1104' ? 51 : 52;
            break;

          case 12:
            rProp = 'authorQ';
            _context3.next = 15;
            return Promise.all(value.map(function () {
              var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref3) {
                var value = _ref3.value,
                    qualifiers = _ref3.qualifiers;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = _name2.default;
                        _context2.next = 3;
                        return fetchWikidataLabelAsync(value, lang);

                      case 3:
                        _context2.t1 = _context2.sent[0];
                        _context2.t2 = (0, _context2.t0)(_context2.t1);
                        _context2.t3 = parseWikidataP1545(qualifiers);
                        return _context2.abrupt('return', [_context2.t2, _context2.t3]);

                      case 7:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x6) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 15:
            rValue = _context3.sent;
            return _context3.abrupt('break', 54);

          case 17:
            rProp = 'authorS';
            rValue = value.map(function (_ref5) {
              var value = _ref5.value,
                  qualifiers = _ref5.qualifiers;
              return [(0, _name2.default)(value), parseWikidataP1545(qualifiers)];
            });
            return _context3.abrupt('break', 54);

          case 20:
            rProp = 'accessed';
            rValue = (0, _date2.default)(value);
            return _context3.abrupt('break', 54);

          case 23:
            rProp = 'DOI';
            return _context3.abrupt('break', 54);

          case 25:
            rProp = 'type';
            rValue = (0, _type2.default)(value);

            if (rValue === undefined) {
              console.warn('[set]', 'This entry type is not recognized and therefore interpreted as \'article-journal\': ' + value);
              rValue = 'article-journal';
            }
            return _context3.abrupt('break', 54);

          case 29:
            rProp = 'ISBN';
            return _context3.abrupt('break', 54);

          case 31:
            rProp = 'issue';
            return _context3.abrupt('break', 54);

          case 33:
            rProp = 'container-title';
            _context3.next = 36;
            return fetchWikidataLabelAsync(value, lang);

          case 36:
            rValue = _context3.sent[0];
            return _context3.abrupt('break', 54);

          case 38:
            rProp = 'page';
            return _context3.abrupt('break', 54);

          case 40:
            rProp = 'edition';
            return _context3.abrupt('break', 54);

          case 42:
            rProp = 'issued';
            rValue = (0, _date2.default)(value);
            return _context3.abrupt('break', 54);

          case 45:
            rProp = 'title';
            return _context3.abrupt('break', 54);

          case 47:
            // (full work available at)
            rProp = 'URL';
            return _context3.abrupt('break', 54);

          case 49:
            rProp = 'volume';
            return _context3.abrupt('break', 54);

          case 51:
            return _context3.abrupt('break', 54);

          case 52:
            console.info('[set]', 'Unknown property: ' + prop);
            return _context3.abrupt('break', 54);

          case 54:
            return _context3.abrupt('return', [rProp, rValue]);

          case 55:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function parseWikidataPropAsync(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.default = parseWikidataPropAsync;