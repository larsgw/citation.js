"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = exports.setAsync = exports.set = exports.addAsync = exports.add = void 0;

var _parse = require("../parse/");

var _fetchId = _interopRequireDefault(require("../util/fetchId"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var add = function add(data) {
  var _data,
      _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (options === true || log === true) {
    this.save();
  }

  (_data = this.data).push.apply(_data, _toConsumableArray((0, _parse.chain)(data, options)));

  this.data.filter(function (entry) {
    return !entry.hasOwnProperty('id');
  }).forEach(function (entry) {
    entry.id = (0, _fetchId.default)(_this.getIds(), 'temp_id_');
  });
  return this;
};

exports.add = add;

var addAsync = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data) {
    var _data2,
        _this2 = this;

    var options,
        log,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            log = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;

            if (options === true || log === true) {
              this.save();
            }

            _context.t0 = (_data2 = this.data).push;
            _context.t1 = _data2;
            _context.t2 = _toConsumableArray;
            _context.next = 8;
            return (0, _parse.chainAsync)(data, options);

          case 8:
            _context.t3 = _context.sent;
            _context.t4 = (0, _context.t2)(_context.t3);

            _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

            this.data.filter(function (entry) {
              return !entry.hasOwnProperty('id');
            }).forEach(function (entry) {
              entry.id = (0, _fetchId.default)(_this2.getIds(), 'temp_id_');
            });
            return _context.abrupt("return", this);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function addAsync(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.addAsync = addAsync;

var set = function set(data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var log = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (options === true || log === true) {
    this.save();
  }

  this.data = [];
  return typeof options !== 'boolean' ? this.add(data, options) : this.add(data);
};

exports.set = set;

var setAsync = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(data) {
    var options,
        log,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            log = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;

            if (options === true || log === true) {
              this.save();
            }

            this.data = [];
            return _context2.abrupt("return", typeof options !== 'boolean' ? this.addAsync(data, options) : this.addAsync(data));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function setAsync(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.setAsync = setAsync;

var reset = function reset(log) {
  if (log) {
    this.save();
  }

  this.data = [];
  this._options = {};
  return this;
};

exports.reset = reset;