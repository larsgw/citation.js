"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.types = exports.scope = void 0;

var _date = _interopRequireDefault(require("../../date"));

var _name = _interopRequireDefault(require("../../name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseContentMine = function parseContentMine(data) {
  var res = {
    type: 'article-journal'
  };
  Object.keys(data).forEach(function (prop) {
    res[prop] = data[prop].value[0];
  });

  if (res.hasOwnProperty('authors')) {
    res.author = data.authors.value.map(_name.default);
  }

  if (res.hasOwnProperty('firstpage')) {
    res.page = res['page-first'] = res.firstpage;
  }

  if (res.hasOwnProperty('date')) {
    res.issued = (0, _date.default)(res.date);
  }

  if (res.hasOwnProperty('journal')) {
    res['container-title'] = res.journal;
  }

  if (res.hasOwnProperty('doi')) {
    res.id = res.DOI = res.doi;
  }

  return res;
};

exports.parse = parseContentMine;
var scope = '@bibjson';
exports.scope = scope;
var types = '@bibjson/object';
exports.types = types;