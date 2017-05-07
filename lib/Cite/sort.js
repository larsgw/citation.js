'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = undefined;

var _label = require('../get/label');

var _label2 = _interopRequireDefault(_label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sort the datasets alphabetically, on basis of it's BibTeX label
 *
 * @method sort
 * @memberof Cite
 * @this Cite
 *
 * @param {Boolean} log - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
var sort = function sort(log) {
  if (log) {
    this.save();
  }

  this.data.sort(function (a, b) {
    var labelA = (0, _label2.default)(a);
    var labelB = (0, _label2.default)(b);

    return labelA !== labelB ? labelA > labelB ? 1 : -1 : 0;
  });

  return this;
};

exports.sort = sort;