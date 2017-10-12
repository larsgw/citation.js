'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _register = require('../../register');

var _chain = require('../async/chain');

var _chain2 = _interopRequireDefault(_chain);

var _fetchFileAsync = require('../../../util/fetchFileAsync');

var _fetchFileAsync2 = _interopRequireDefault(_fetchFileAsync);

var _json = require('../../modules/wikidata/json');

var _api = require('../../modules/doi/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var parsers = {
  '@wikidata/api': _fetchFileAsync2.default,
  '@wikidata/object': _json.parseAsync,
  '@doi/api': _api.parseAsync,
  '@else/url': _fetchFileAsync2.default,
  '@else/list+object': function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
      var _ref2;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = (_ref2 = []).concat;
              _context.t1 = _ref2;
              _context.t2 = _toConsumableArray;
              _context.next = 5;
              return Promise.all(input.map(_chain2.default));

            case 5:
              _context.t3 = _context.sent;
              _context.t4 = (0, _context.t2)(_context.t3);
              return _context.abrupt('return', _context.t0.apply.call(_context.t0, _context.t1, _context.t4));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    function elseListObject(_x) {
      return _ref.apply(this, arguments);
    }

    return elseListObject;
  }()
};

for (var type in parsers) {
  (0, _register.add)(type, { parseAsync: parsers[type] });
}

exports.default = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(data, type) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', parsers[type](data));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function parseInputDataAsync(_x2, _x3) {
    return _ref3.apply(this, arguments);
  }

  return parseInputDataAsync;
}();