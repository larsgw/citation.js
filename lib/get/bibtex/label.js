'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Get a BibTeX label from CSL data
 *
 * @access protected
 * @method getBibTeXLabel
 *
 * @param {CSL} src - Input CSL
 *
 * @return {String} The label
 */
var getBibTeXLabel = function getBibTeXLabel() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$author = _ref.author,
      author = _ref$author === undefined ? [] : _ref$author,
      year = _ref.year,
      _ref$issued = _ref.issued,
      issued = _ref$issued === undefined ? [] : _ref$issued,
      title = _ref.title;

  var res = '';

  if (author.length > 0) {
    res += author[0].family || author[0].literal;
  }

  if (year) {
    res += year;
  } else if (issued.length > 0 && issued[0]['date-parts']) {
    res += issued[0]['date-parts'][0];
  }

  if (title) {
    res += title.match(/^(?:(?:the|a|an)\s+)?(\S+)/i)[1];
  }

  return res;
};

exports.default = getBibTeXLabel;