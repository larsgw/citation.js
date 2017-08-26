'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chain = require('../async/chain');

var _chain2 = _interopRequireDefault(_chain);

var _data = require('../data');

var _data2 = _interopRequireDefault(_data);

var _fetchFileAsync = require('../../../util/fetchFileAsync');

var _fetchFileAsync2 = _interopRequireDefault(_fetchFileAsync);

var _json = require('../../wikidata/async/json');

var _json2 = _interopRequireDefault(_json);

var _api = require('../../doi/async/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Standardise input (internal use)
 *
 * @access protected
 * @method parseInputDataAsync
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {String} type - The input type
 *
 * @return {Array<CSL>} The parsed input
 */
var parseInputDataAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input, type) {
    var _ref2;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = type;
            _context.next = _context.t0 === 'api/wikidata' ? 3 : _context.t0 === 'object/wikidata' ? 4 : _context.t0 === 'api/doi' ? 5 : _context.t0 === 'url/else' ? 6 : _context.t0 === 'array/else' ? 7 : 15;
            break;

          case 3:
            return _context.abrupt('return', (0, _fetchFileAsync2.default)(input));

          case 4:
            return _context.abrupt('return', (0, _json2.default)(input));

          case 5:
            return _context.abrupt('return', (0, _api2.default)(input));

          case 6:
            return _context.abrupt('return', (0, _fetchFileAsync2.default)(input));

          case 7:
            _context.t1 = (_ref2 = []).concat;
            _context.t2 = _ref2;
            _context.t3 = _toConsumableArray;
            _context.next = 12;
            return Promise.all(input.map(function (value) {
              return (0, _chain2.default)(value);
            }));

          case 12:
            _context.t4 = _context.sent;
            _context.t5 = (0, _context.t3)(_context.t4);
            return _context.abrupt('return', _context.t1.apply.call(_context.t1, _context.t2, _context.t5));

          case 15:
            return _context.abrupt('return', (0, _data2.default)(input, type));

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function parseInputDataAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = parseInputDataAsync;