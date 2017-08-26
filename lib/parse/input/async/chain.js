'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepCopy = require('../../../util/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _data = require('../async/data');

var _data2 = _interopRequireDefault(_data);

var _type = require('../type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Parse input until success. (async)
 *
 * @access protected
 * @method parseInputAsync
 *
 * @param {String|Array<String>|Object|Array<Object>} input - The input data
 * @param {Object} [options] - Options
 * @param {Number} [options.maxChainLength=10] - Max. number of parsing iterations before giving up
 *
 * @return {Promise} The parsed input
 */
var parseInputAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$maxChainLength = _ref2.maxChainLength,
        maxChainLength = _ref2$maxChainLength === undefined ? 10 : _ref2$maxChainLength;

    var type, output;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = (0, _type2.default)(input);
            output = type.match(/^(array|object)\//) ? (0, _deepCopy2.default)(input) : input;

          case 2:
            if (!(type !== 'array/csl')) {
              _context.next = 12;
              break;
            }

            if (!(maxChainLength-- <= 0)) {
              _context.next = 6;
              break;
            }

            console.error('[set]', 'Max. number of parsing iterations reached');
            return _context.abrupt('return', []);

          case 6:
            _context.next = 8;
            return (0, _data2.default)(output, type);

          case 8:
            output = _context.sent;

            type = (0, _type2.default)(output);
            _context.next = 2;
            break;

          case 12:
            return _context.abrupt('return', output);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function parseInputAsync(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = parseInputAsync;