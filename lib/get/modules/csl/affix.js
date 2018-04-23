"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWrappedEntry = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getAffix = function getAffix(source, affix) {
  return typeof affix === 'function' ? affix(source) : typeof affix === 'string' ? affix : '';
};

var htmlRegex = /^(\s*<[a-z0-9:-]+(?:\s*[a-z0-9:-]+=(?:"(?:\\\\|\\"|[^"])*"|'(?:\\\\|\\'|[^'])*'|\w+))*\s*>)([\s\S]+)(<\/[a-z:]+>\s*)$/i;

var getWrappedEntry = function getWrappedEntry(value, source, _ref) {
  var prepend = _ref.prepend,
      append = _ref.append;

  var _ref2 = value.match(htmlRegex) || [],
      _ref3 = _slicedToArray(_ref2, 4),
      _ref3$ = _ref3[1],
      start = _ref3$ === void 0 ? '' : _ref3$,
      _ref3$2 = _ref3[2],
      content = _ref3$2 === void 0 ? value : _ref3$2,
      _ref3$3 = _ref3[3],
      end = _ref3$3 === void 0 ? '' : _ref3$3;

  var prefix = getAffix(source, prepend);
  var suffix = getAffix(source, append);
  return start + prefix + content + suffix + end;
};

exports.getWrappedEntry = getWrappedEntry;