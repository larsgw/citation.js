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
 * Recreate a `Cite` object with almost any kind of data, and manipulate it with its default methods.
 *
 * @method set
 * @memberof Cite
 * @this Cite
 *
 * @param {String|CSL|Object|String[]|CSL[]|Object[]} data - The data to replace the data in your object
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
exports.set = set;
exports.reset = reset;