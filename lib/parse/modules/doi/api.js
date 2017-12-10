'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAsync = exports.parse = exports.types = exports.scope = undefined;

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchDoiApiAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
    var headers;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            headers = new Headers();

            headers.append('Accept', 'application/vnd.citationstyles.csl+json');
            _context.next = 5;
            return fetch(url, { headers: headers });

          case 5:
            return _context.abrupt('return', _context.sent.json());

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            logger.error('[set]', 'File \'' + url + '\' could not be fetched:', _context.t0.message);
            return _context.abrupt('return', {});

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 8]]);
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
            return _context2.abrupt('return', doiJsonList.map(_json2.default));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function parseDoiApiAsync(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchDoiApi = function fetchDoiApi(url) {
  try {
    return JSON.parse((0, _syncRequest2.default)('GET', url, {
      headers: {
        Accept: 'application/vnd.citationstyles.csl+json'
      },
      allowRedirectHeaders: ['Accept']
    }).getBody('utf8'));
  } catch (e) {
    logger.error('[set]', 'File \'' + url + '\' could not be fetched:', e.message);
    return {};
  }
};

var parseDoiApi = function parseDoiApi(data) {
  return [].concat(data).map(fetchDoiApi).map(_json2.default);
};

var scope = exports.scope = '@doi';
var types = exports.types = '@doi/api';
exports.parse = parseDoiApi;
exports.parseAsync = parseDoiApiAsync;