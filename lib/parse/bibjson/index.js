'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _date = require('../date');

var _date2 = _interopRequireDefault(_date);

var _name = require('../name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Format ContentMine data
 * 
 * @access private
 * @method parseContentMine
 * 
 * @param {Object} data - The input data
 * 
 * @return {CSL[]} The formatted input data
 */
var parseContentMine = function parseContentMine(data) {
  var res = {},
      dataKeys = Object.keys(data);

  for (var dataKeyIndex = 0; dataKeyIndex < dataKeys.length; dataKeyIndex++) {
    var prop = dataKeys[dataKeyIndex];
    res[prop] = data[prop].value[0];
  }

  res.type = 'article-journal';

  if (res.hasOwnProperty('authors')) res.author = data.authors.value.map(_name2.default);
  if (res.hasOwnProperty('firstpage')) res['page-first'] = res.firstpage, res.page = res.firstpage;
  if (res.hasOwnProperty('date')) res.issued = (0, _date2.default)(res.date);
  if (res.hasOwnProperty('journal')) res['container-title'] = res.journal;
  if (res.hasOwnProperty('doi')) res.id = res.doi, res.DOI = res.doi;

  return res;
};

exports.default = parseContentMine;