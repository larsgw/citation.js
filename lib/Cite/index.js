'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('./log');

var log = _interopRequireWildcard(_log);

var _options = require('./options');

var options = _interopRequireWildcard(_options);

var _set = require('./set');

var set = _interopRequireWildcard(_set);

var _sort = require('./sort');

var sort = _interopRequireWildcard(_sort);

var _get = require('./get');

var get = _interopRequireWildcard(_get);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Cite(data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(this instanceof Cite)) {
    return new Cite(data, options);
  }

  this._options = options || {};

  this.log = [];

  this.data = [];

  this.set(data, options);
  this.options(options);
  this.save();

  return this;
}

Object.assign(Cite.prototype, log, options, set, sort, get);

Cite.prototype[Symbol.iterator] = regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.delegateYield(this.data, 't0', 1);

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
});

exports.default = Cite;