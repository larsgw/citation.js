'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Format Wikidata data (async)
 *
 * @access protected
 * @method parseWikidataJSONAsync
 *
 * @param {Object} data - The input data
 *
 * @return {Array<CSL>} The formatted input data
 */
var parseWikidataJSONAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(data) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', Promise.all(Object.keys(data.entities).map(function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(entityKey) {
                var _this = this;

                var _data$entities$entity, labels, claims, entity, json;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _data$entities$entity = data.entities[entityKey], labels = _data$entities$entity.labels, claims = _data$entities$entity.claims;
                        entity = _wikidataSdk2.default.simplifyClaims(claims, null, null, true);
                        json = {
                          _wikiId: entityKey,
                          id: entityKey
                        };
                        _context2.next = 5;
                        return Promise.all(Object.keys(entity).map(function () {
                          var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(prop) {
                            var field, _field, fieldName, fieldValue;

                            return regeneratorRuntime.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return (0, _prop2.default)(prop, entity[prop], 'en');

                                  case 2:
                                    field = _context.sent;

                                    if (field) {
                                      _field = _slicedToArray(field, 2), fieldName = _field[0], fieldValue = _field[1];


                                      if (Array.isArray(json[fieldName])) {
                                        json[fieldName] = json[fieldName].concat(fieldValue);
                                      } else if (fieldValue !== undefined) {
                                        json[fieldName] = fieldValue;
                                      }
                                    }

                                  case 4:
                                  case 'end':
                                    return _context.stop();
                                }
                              }
                            }, _callee, _this);
                          }));

                          return function (_x3) {
                            return _ref3.apply(this, arguments);
                          };
                        }()));

                      case 5:

                        if (Array.isArray(json.author)) {
                          json.author.sort(function (_ref4, _ref5) {
                            var a = _ref4._ordinal;
                            var b = _ref5._ordinal;
                            return a - b;
                          });
                        }

                        if (!json.title) {
                          json.title = labels['en'].value;
                        }

                        return _context2.abrupt('return', json);

                      case 8:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }())));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function parseWikidataJSONAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = parseWikidataJSONAsync;