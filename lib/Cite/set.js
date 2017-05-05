'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = exports.set = exports.add = undefined;

var _chain = require('../parse/input/chain');

var _chain2 = _interopRequireDefault(_chain);

var _fetchId = require('../util/fetchId');

var _fetchId2 = _interopRequireDefault(_fetchId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add an object to the array of objects
 *
 * @method add
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - The data to add to your object
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated parent object
 */
var add = function add(data, nolog) {
  var _this = this;

  if (!nolog) {
    this._log.push({ name: 'add', version: this.currentVersion() + 1, arguments: [data, nolog] });
  }

  this.data = this.data.concat((0, _chain2.default)(data));

  this.data.filter(function (entry) {
    return !entry.hasOwnProperty('id');
  }).forEach(function (entry) {
    entry.id = (0, _fetchId2.default)(_this.getIds(true), 'temp_id_');
  });

  return this;
};

/**
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @method set
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - The data to replace the data in your object
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated parent object
 */
var set = function set(data, nolog) {
  if (!nolog) {
    this._log.push({ name: 'set', version: this.currentVersion() + 1, arguments: [data, nolog] });
  }

  this.data = [];
  this.add(data, true);

  return this;
};

/**
 * Reset a `Cite` object.
 *
 * @method reset
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {Cite} The updated, empty parent object (except the log, the log lives)
 */
var reset = function reset(nolog) {
  if (!nolog) {
    this._log.push({ name: 'reset', version: this.currentVersion() + 1, arguments: [] });
  }

  this.data = [];
  this._options = {};

  return this;
};

exports.add = add;
exports.set = set;
exports.reset = reset;