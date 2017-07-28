'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Format CrossRef JSON
 *
 * @access protected
 * @method parseDoiJson
 *
 * @param {Object} data - The input data
 *
 * @return {CSL} The formatted input data
 */
var parseDoiJson = function parseDoiJson(data) {
  var res = {
    type: (0, _type2.default)(data.type)
  };

  var dateFields = ['submitted', 'issued', 'event-date', 'original-date', 'container', 'accessed'];
  dateFields.forEach(function (field) {
    if (data[field] && typeof data[field]['date-parts'][0] === 'number') {
      data[field]['date-parts'] = [data[field]['date-parts']];
    }
  });

  return Object.assign({}, data, res);
};

exports.default = parseDoiJson;