'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = bibliography;

var _engines = require('./engines');

var _engines2 = _interopRequireDefault(_engines);

var _attr = require('./attr.js');

var _affix = require('./affix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bibliography(data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$template = options.template,
      template = _options$template === undefined ? 'apa' : _options$template,
      _options$lang = options.lang,
      lang = _options$lang === undefined ? 'en-US' : _options$lang,
      _options$format = options.format,
      format = _options$format === undefined ? 'text' : _options$format;

  var citeproc = (0, _engines2.default)(data, template, lang, format);
  var sortedIds = citeproc.updateItems(data.map(function (entry) {
    return entry.id;
  }));

  var bibliography = citeproc.makeBibliography();

  var _bibliography = _slicedToArray(bibliography, 2),
      _bibliography$ = _bibliography[0],
      bibstart = _bibliography$.bibstart,
      bibend = _bibliography$.bibend,
      bibBody = _bibliography[1];

  var entries = bibBody.map(function (element, index) {
    return (0, _attr.getPrefixedEntry)(element, sortedIds[index]);
  });

  if (options.append || options.prepend) {
    var append = options.append,
        prepend = options.prepend;

    var items = data.reduce(function (items, entry) {
      items[entry.id] = entry;return items;
    }, {});
    var sortedItems = sortedIds.map(function (id) {
      return items[id];
    });

    entries.forEach(function (entry, index) {
      entries[index] = (0, _affix.getWrappedEntry)(entry, sortedItems[index], { append: append, prepend: prepend });
    });
  }

  return bibstart + entries.join('') + bibend;
}