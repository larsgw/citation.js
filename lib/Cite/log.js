"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.save = exports.undo = exports.retrieveLastVersion = exports.retrieveVersion = exports.currentVersion = void 0;

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var currentVersion = function currentVersion() {
  return this.log.length;
};

exports.currentVersion = currentVersion;

var retrieveVersion = function retrieveVersion() {
  var versnum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (versnum <= 0 || versnum > this.currentVersion()) {
    return null;
  } else {
    var _log = _slicedToArray(this.log[versnum - 1], 2),
        data = _log[0],
        options = _log[1];

    var image = new _index.default(JSON.parse(data), JSON.parse(options));
    image.log = this.log.slice(0, versnum);
    return image;
  }
};

exports.retrieveVersion = retrieveVersion;

var undo = function undo() {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  return this.retrieveVersion(this.currentVersion() - number);
};

exports.undo = undo;

var retrieveLastVersion = function retrieveLastVersion() {
  return this.retrieveVersion(this.currentVersion());
};

exports.retrieveLastVersion = retrieveLastVersion;

var save = function save() {
  this.log.push([JSON.stringify(this.data), JSON.stringify(this._options)]);
  return this;
};

exports.save = save;