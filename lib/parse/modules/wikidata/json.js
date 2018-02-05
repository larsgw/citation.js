"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAsync = exports.default = exports.parse = exports.types = exports.scope = void 0;

var _wikidataSdk = _interopRequireDefault(require("wikidata-sdk"));

var _prop = require("./prop");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var parseWikidataJSONAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(data) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", Promise.all(Object.keys(data.entities).map(function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(entityKey) {
                var _data$entities$entity, labels, claims, entity, json;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _data$entities$entity = data.entities[entityKey], labels = _data$entities$entity.labels, claims = _data$entities$entity.claims;
                        entity = _wikidataSdk.default.simplifyClaims(claims, null, null, true);
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
                                    return (0, _prop.parseAsync)(prop, entity[prop], 'en');

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
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee, this);
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

                        return _context2.abrupt("return", json);

                      case 8:
                      case "end":
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
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function parseWikidataJSONAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.parseAsync = parseWikidataJSONAsync;

var parseWikidataJSON = function parseWikidataJSON(data) {
  return Object.keys(data.entities).map(function (entityKey) {
    var _data$entities$entity2 = data.entities[entityKey],
        labels = _data$entities$entity2.labels,
        claims = _data$entities$entity2.claims;

    var entity = _wikidataSdk.default.simplifyClaims(claims, null, null, true);

    var json = {
      _wikiId: entityKey,
      id: entityKey
    };
    Object.keys(entity).forEach(function (prop) {
      var field = (0, _prop.parse)(prop, entity[prop], 'en');

      if (field) {
        var _field2 = _slicedToArray(field, 2),
            fieldName = _field2[0],
            fieldValue = _field2[1];

        if (Array.isArray(json[fieldName])) {
          json[fieldName] = json[fieldName].concat(fieldValue);
        } else if (fieldValue !== undefined) {
          json[fieldName] = fieldValue;
        }
      }
    });

    if (Array.isArray(json.author)) {
      json.author.sort(function (_ref6, _ref7) {
        var a = _ref6._ordinal;
        var b = _ref7._ordinal;
        return a - b;
      });
    }

    if (!json.title) {
      json.title = labels['en'].value;
    }

    return json;
  });
};

exports.default = exports.parse = parseWikidataJSON;
var scope = '@wikidata';
exports.scope = scope;
var types = '@wikidata/object';
exports.types = types;