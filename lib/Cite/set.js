'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = exports.setAsync = exports.set = exports.addAsync = exports.add = undefined;

var _chain = require('../parse/input/chain');

var _chain2 = _interopRequireDefault(_chain);

var _chain3 = require('../parse/input/async/chain');

var _chain4 = _interopRequireDefault(_chain3);

var _fetchId = require('../util/fetchId');

var _fetchId2 = _interopRequireDefault(_fetchId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Add an object to the array of objects
 *
 * @method add
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|Array<String>|Array<CSL>|Array<Object>} data - The data to add to your object
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
var add = function add(data, log) {
  var _this = this;

  if (log) {
    this.save();
  }

  this.data = this.data.concat((0, _chain2.default)(data));

  this.data.filter(function (entry) {
    return !entry.hasOwnProperty('id');
  }).forEach(function (entry) {
    entry.id = (0, _fetchId2.default)(_this.getIds(), 'temp_id_');
  });

  return this;
};

/**
 * Add an object to the array of objects
 *
 * @method addAsync
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|Array<String>|Array<CSL>|Array<Object>} data - The data to add to your object
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
var addAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data, log) {
    var _this2 = this;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (log) {
              this.save();
            }

            _context.t0 = this.data;
            _context.next = 4;
            return (0, _chain4.default)(data);

          case 4:
            _context.t1 = _context.sent;
            this.data = _context.t0.concat.call(_context.t0, _context.t1);


            this.data.filter(function (entry) {
              return !entry.hasOwnProperty('id');
            }).forEach(function (entry) {
              entry.id = (0, _fetchId2.default)(_this2.getIds(), 'temp_id_');
            });

            return _context.abrupt('return', this);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function addAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @method set
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|Array<String>|Array<CSL>|Array<Object>} data - The data to replace the data in your object
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
var set = function set(data, log) {
  if (log) {
    this.save();
  }

  this.data = [];
  this.add(data);

  return this;
};

/**
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @method setAsync
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|Array<String>|Array<CSL>|Array<Object>} data - The data to replace the data in your object
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
var setAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(data, log) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (log) {
              this.save();
            }

            this.data = [];
            _context2.next = 4;
            return this.addAsync(data);

          case 4:
            return _context2.abrupt('return', this);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function setAsync(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Reset a `Cite` object.
 *
 * @method reset
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated, empty parent object (except the log, the log lives)
 */
var reset = function reset(log) {
  if (log) {
    this.save();
  }

  this.data = [];
  this._options = {};

  return this;
};

exports.add = add;
exports.addAsync = addAsync;
exports.set = set;
exports.setAsync = setAsync;
exports.reset = reset;