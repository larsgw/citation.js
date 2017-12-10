'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var getAttributedEntry = function getAttributedEntry(string, name, value) {
  return string.replace(/^\s*<[a-z]+/i, function (match) {
    return match + ' data-' + name + '="' + value + '"';
  });
};

var getPrefixedEntry = function getPrefixedEntry(value, id) {
  return getAttributedEntry(value, 'csl-entry-id', id);
};

var getAffix = function getAffix(source, affix) {
  return typeof affix === 'function' ? affix(source) : typeof affix === 'string' ? affix : '';
};

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