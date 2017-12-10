'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _static = require('./static');

var _attr = require('../util/attr.js');

var _json = require('../get/bibtex/json');

var _json2 = _interopRequireDefault(_json);

var _text = require('../get/bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _bibtxt = require('../get/bibtxt');

var _bibtxt2 = _interopRequireDefault(_bibtxt);

var _json3 = require('../get/json');

var _json4 = _interopRequireDefault(_json3);

var _csl = require('../parse/csl');

var _csl2 = _interopRequireDefault(_csl);

var _engines = require('../CSL/engines');

var _engines2 = _interopRequireDefault(_engines);

var _styles = require('../CSL/styles');

var _styles2 = _interopRequireDefault(_styles);

var _locales = require('../CSL/locales');

var _locales2 = _interopRequireDefault(_locales);

var _items = require('../CSL/items');

var _items2 = _interopRequireDefault(_items);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getIds = function getIds() {
  return this.data.map(function (entry) {
    return entry.id;
  });
};

var get = function get() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  try {
    (0, _static.validateOutputOptions)(options);
  } catch (_ref) {
    var message = _ref.message;

    logger.warn('[get]', message);
  }

  var _Object$assign = Object.assign({}, this.defaultOptions, this._options.output, options),
      format = _Object$assign.format,
      type = _Object$assign.type,
      style = _Object$assign.style,
      lang = _Object$assign.lang,
      append = _Object$assign.append,
      prepend = _Object$assign.prepend;

  var _style$match = style.match(/^([^-]+)(?:-(.+))?$/),
      _style$match2 = _slicedToArray(_style$match, 3),
      styleType = _style$match2[1],
      styleFormat = _style$match2[2];

  var data = (0, _csl2.default)(this.data);
  var result = void 0;

  switch (styleType) {
    case 'citation':
      if (type === 'json') {
        logger.error('[get]', 'Combination type/style of json/citation-* is not valid: ' + type + '/' + style);
        break;
      }

      var useLang = (0, _locales2.default)(lang) ? lang : 'en-US';
      var useTemplate = (0, _styles2.default)(styleFormat);
      var cbItem = (0, _items2.default)(data);

      var citeproc = (0, _engines2.default)(styleFormat, useLang, useTemplate, cbItem, _locales2.default);
      var sortedIds = citeproc.updateItems(this.getIds());

      citeproc.setOutputFormat({ string: 'text' }[type] || type);

      var _citeproc$makeBibliog = citeproc.makeBibliography(),
          _citeproc$makeBibliog2 = _slicedToArray(_citeproc$makeBibliog, 2),
          _citeproc$makeBibliog3 = _citeproc$makeBibliog2[0],
          bibStart = _citeproc$makeBibliog3.bibstart,
          bibEnd = _citeproc$makeBibliog3.bibend,
          bibBody = _citeproc$makeBibliog2[1];

      var entries = bibBody.map(function (element, index) {
        return (0, _attr.getPrefixedEntry)(element, sortedIds[index]);
      });

      if (append || prepend) {
        var sortedItems = sortedIds.map(function (itemId) {
          return _this.data.find(function (_ref2) {
            var id = _ref2.id;
            return id === itemId;
          });
        });
        entries = entries.map(function (element, index) {
          return (0, _attr.getWrappedEntry)(element, sortedItems[index], { append: append, prepend: prepend });
        });
      }

      result = bibStart + entries.join('') + bibEnd;
      break;

    case 'csl':
      if (type === 'html') {
        result = (0, _json4.default)(data);
      } else if (type === 'string') {
        result = JSON.stringify(data, null, 2);
      } else if (type === 'json') {
        result = JSON.stringify(data);
      }
      break;

    case 'bibtex':
      if (type === 'html') {
        result = (0, _text2.default)(data, true);
      } else if (type === 'string') {
        result = (0, _text2.default)(data, false);
      } else if (type === 'json') {
        result = JSON.stringify(data.map(_json2.default));
      }
      break;

    case 'bibtxt':
      if (type === 'html') {
        result = (0, _bibtxt2.default)(data, true);
      } else if (type === 'string') {
        result = (0, _bibtxt2.default)(data, false);
      } else if (type === 'json') {
        result = JSON.stringify(data.map(_json2.default));
      }
      break;

    default:
      logger.error('[get]', 'Invalid options');
      break;
  }

  if (format === 'real') {
    if (type === 'json') {
      result = JSON.parse(result);
    } else if (type === 'html' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
      var tmp = document.createElement('div');
      tmp.innerHTML = result;
      result = tmp.firstChild;
    }
  }

  return result;
};

exports.getIds = getIds;
exports.get = get;