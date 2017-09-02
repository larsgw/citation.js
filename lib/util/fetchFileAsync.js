'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('isomorphic-fetch');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global fetch */

/**
 * Fetch file (async)
 *
 * @access protected
 * @method fetchFileAsync
 *
 * @param {String} url - The input url
 *
 * @return {String} The fetched string
 */
var fetchFileAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fetch(url);

          case 3:
            return _context.abrupt('return', _context.sent.text());

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);

            console.error('[set]', 'File \'' + url + '\' could not be fetched:', _context.t0.message);
            return _context.abrupt('return', '[]');

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function fetchFileAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = fetchFileAsync;