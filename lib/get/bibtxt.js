'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _json = require('./bibtex/json');

var _json2 = _interopRequireDefault(_json);

var _dict = require('./dict');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a Bib.TXT (HTML) string from CSL
 *
 * @access protected
 * @method getBibTxt
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Boolean} html - Output as HTML string (instead of plain text)
 *
 * @return {String} BibTeX (HTML) string
 */
var getBibTxt = function getBibTxt(src, html) {
  var dict = html ? _dict.htmlDict : _dict.textDict;

  var entries = src.map(function (entry) {
    var bib = (0, _json2.default)(entry);
    var properties = Object.keys(bib.properties).map(function (prop) {
      return '' + dict.li_start + prop + ': ' + bib.properties[prop] + dict.li_end;
    }).join('');

    return dict.en_start + '[' + bib.label + ']' + dict.ul_start + dict.li_start + 'type: ' + bib.type + dict.li_end + properties + dict.ul_end + dict.en_end;
  }).join('\n');

  return '' + dict.wr_start + entries + dict.wr_end;
};

exports.default = getBibTxt;