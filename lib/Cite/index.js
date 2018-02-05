"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var log = _interopRequireWildcard(require("./log"));

var options = _interopRequireWildcard(require("./options"));

var set = _interopRequireWildcard(require("./set"));

var sort = _interopRequireWildcard(require("./sort"));

var get = _interopRequireWildcard(require("./get"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
          return _context.delegateYield(this.data, "t0", 1);

        case 1:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
});
var _default = Cite;
exports.default = _default;