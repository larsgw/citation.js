'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.save = exports.undo = exports.retrieveLastVersion = exports.retrieveVersion = exports.currentVersion = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentVersion = function currentVersion() {
  return this.log.length;
};

var retrieveVersion = function retrieveVersion() {
  var versnum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  if (versnum <= 0 || versnum > this.currentVersion()) {
    return null;
  } else {
    var _log = _slicedToArray(this.log[versnum - 1], 2),
        data = _log[0],
        options = _log[1];

    var image = new _index2.default(JSON.parse(data), JSON.parse(options));
    image.log = this.log.slice(0, versnum);
    return image;
  }
};

var undo = function undo() {
  var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  return this.retrieveVersion(this.currentVersion() - number);
};

var retrieveLastVersion = function retrieveLastVersion() {
  return this.retrieveVersion(this.currentVersion());
};

var save = function save() {
  this.log.push([JSON.stringify(this.data), JSON.stringify(this._options)]);

  return this;
};

exports.currentVersion = currentVersion;
exports.retrieveVersion = retrieveVersion;
exports.retrieveLastVersion = retrieveLastVersion;
exports.undo = undo;
exports.save = save;