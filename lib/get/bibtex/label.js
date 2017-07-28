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
      author = _ref.author,
      issued = _ref.issued,
      title = _ref.title;

  var res = '';

  if (author) {
    res += author[0].family || author[0].literal;
  }
  if (issued && issued['date-parts'][0]) {
    res += issued['date-parts'][0][0];
  }
  if (title) {
    res += title.match(/^(?:(?:the|a|an)\s+)?(\S+)/i)[1];
  }

  return res;
};

exports.default = getBibTeXLabel;