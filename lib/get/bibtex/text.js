'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _json = require('./json');

var _json2 = _interopRequireDefault(_json);

var _dict = require('../dict');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var varBibTeXSyntaxTokens = {
  '|': '{\\textbar}',
  '<': '{\\textless}',
  '>': '{\\textgreater}',
  '~': '{\\textasciitilde}',
  '^': '{\\textasciicircum}',
  '\\': '{\\textbackslash}',

  '{': '\\{\\vphantom{\\}}',
  '}': '\\vphantom{\\{}\\}'
};

var getBibTeX = function getBibTeX(src, html) {
  var dict = html ? _dict.htmlDict : _dict.textDict;
  var caseSensitive = ['title'];

  var entries = src.map(function (entry) {
    var bib = (0, _json2.default)(entry);
    var properties = Object.keys(bib.properties).map(function (prop) {
      var value = bib.properties[prop].replace(/[|<>~^\\{}]/g, function (match) {
        return varBibTeXSyntaxTokens[match];
      });
      var delStart = value === parseInt(value).toString() ? '' : caseSensitive.includes(prop) ? '{{' : '{';
      var delEnd = delStart.replace(/{/g, '}').split('').reverse().join('');

      return '' + dict.li_start + prop + '=' + delStart + value + delEnd + ',' + dict.li_end;
    }).join('');

    return dict.en_start + '@' + bib.type + '{' + bib.label + ',' + dict.ul_start + properties + dict.ul_end + '}' + dict.en_end;
  }).join('');

  return '' + dict.wr_start + entries + dict.wr_end;
};

exports.default = getBibTeX;