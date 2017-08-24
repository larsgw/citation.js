'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Add data-* attribute to a HTML string
 *
 * @access protected
 * @method getAttributedEntry
 *
 * @param {String} string - HTML string
 * @param {String} name - attribute name
 * @param {String} value - attribute value
 *
 * @return {String} HTML string with attribute
 */
var getAttributedEntry = function getAttributedEntry(string, name, value) {
  return string.replace(/^\s*<[a-z]+/i, function (match) {
    return match + ' data-' + name + '="' + value + '"';
  });
};

/**
 * Add CSL identifiers to entry
 *
 * @access protected
 * @method getPrefixedEntry
 *
 * @param {String} value - HTML string
 * @param {String|Number} id - ID
 *
 * @return {String} HTML string with CSL ID
 */
var getPrefixedEntry = function getPrefixedEntry(value, id) {
  return getAttributedEntry(value, 'csl-entry-id', id);
};

/**
 * Get a rendered affix
 *
 * @access private
 * @method getAffix
 *
 * @param {CSL} source - source element
 * @param {String|Cite~wrapper} affix
 *
 * @return {String} Rendered affixs
 */
var getAffix = function getAffix(source, affix) {
  return typeof affix === 'function' ? affix(source) : typeof affix === 'string' ? affix : '';
};

/**
 * Pre/append things to entry
 *
 * @access protected
 * @method getWrappedEntry
 *
 * @param {String} value - HTML string
 * @param {CSL} source - source element
 * @param {Object} wrapping - append / prepend configuration
 * @param {String|Cite~wrapper} [wrapping.prepend]
 * @param {String|Cite~wrapper} [wrapping.append]
 *
 * @return {String} Wrapped HTML string
 */
var getWrappedEntry = function getWrappedEntry(value, source, _ref) {
  var prepend = _ref.prepend,
      append = _ref.append;

  var _ref2 = value.match(/^(\s*<[a-z0-9:-]+(?:\s*[a-z0-9:-]+=(?:"(?:\\\\|\\"|[^"])*"|'(?:\\\\|\\'|[^'])*'|\w+))*\s*>)([\s\S]+)(<\/[a-z:]+>\s*)$/i) || [],
      _ref3 = _slicedToArray(_ref2, 4),
      a = _ref3[1],
      c = _ref3[2],
      e = _ref3[3];

  var b = getAffix(source, prepend);
  var d = getAffix(source, append);
  return a + b + c + d + e;
};

exports.getAttributedEntry = getAttributedEntry;
exports.getPrefixedEntry = getPrefixedEntry;
exports.getWrappedEntry = getWrappedEntry;