'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('isomorphic-fetch');

var _json = require('../json');

var _json2 = _interopRequireDefault(_json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global fetch, Headers */

/**
 * Fetch DOI API results
 *
 * @access private
 * @method fetchDoiApiAsync
 *
 * @param {String} url - The input url
 *
 * @return {CSL} The fetched JSON
 */
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

            console.error('[set]', 'File \'' + url + '\' could not be fetched:', _context.t0.message);
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

/**
 * Get CSL JSON from DOI API URLs.
 *
 * @access protected
 * @method parseDoiApiAsync
 *
 * @param {String|Array<String>} data - DOIs
 *
 * @return {Array<CSL>} Array of CSL
 */
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

exports.default = parseDoiApiAsync;