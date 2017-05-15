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
 * @param {String|String[]|Object|Object[]} input - The input data
 *
 * @return {Promise} The parsed input
 */
var parseInputAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
    var output, type;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            output = input;
            type = (0, _type2.default)(output);


            if (type.match(/^(array|object)\//)) {
              output = (0, _deepCopy2.default)(output);
            }

            // TODO max recursion level

          case 3:
            if (!(type !== 'array/csl')) {
              _context.next = 10;
              break;
            }

            _context.next = 6;
            return (0, _data2.default)(output, type);

          case 6:
            output = _context.sent;

            type = (0, _type2.default)(output);
            _context.next = 3;
            break;

          case 10:
            return _context.abrupt('return', output);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function parseInputAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = parseInputAsync;