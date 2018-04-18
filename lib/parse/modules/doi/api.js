"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAsync = exports.parse = exports.types = exports.scope = void 0;

var _json = _interopRequireDefault(require("./json"));

var _fetchFile = _interopRequireDefault(require("../../../util/fetchFile"));

var _fetchFileAsync = _interopRequireDefault(require("../../../util/fetchFileAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var apiHeaders = {
  Accept: 'application/vnd.citationstyles.csl+json'
};

var fetchDoiApiAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _fetchFileAsync.default)(url, {
              headers: apiHeaders
            });

          case 2:
            result = _context.sent;
            return _context.abrupt("return", result === '[]' ? result : {});

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchDoiApiAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

var parseDoiApiAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(data) {
    var doiJsonList;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Promise.all([].concat(data).map(fetchDoiApiAsync));

          case 2:
            doiJsonList = _context2.sent;
            return _context2.abrupt("return", doiJsonList.map(_json.default));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function parseDoiApiAsync(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.parseAsync = parseDoiApiAsync;

var fetchDoiApi = function fetchDoiApi(url) {
  var result = (0, _fetchFile.default)(url, {
    headers: apiHeaders
  });
  return result === '[]' ? result : {};
};

var parseDoiApi = function parseDoiApi(data) {
  return [].concat(data).map(fetchDoiApi).map(_json.default);
};

exports.parse = parseDoiApi;
var scope = '@doi';
exports.scope = scope;
var types = '@doi/api';
exports.types = types;