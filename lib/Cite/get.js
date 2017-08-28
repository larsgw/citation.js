'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

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

/**
 * Get a list of the data entry IDs, in the order of that list
 *
 * @method getIds
 * @memberof Cite
 * @this Cite
 *
 * @return {Array<String>} List of IDs
 */
var getIds = function getIds() {
  return this.data.map(function (entry) {
    return entry.id;
  });
};

/**
 * Get formatted data from your object. For more info, see [Output](../#cite.out).
 *
 * @method get
 * @memberof Cite
 * @this Cite
 *
 * @param {Object} [options={}] - [Output options](../#cite.out.options)
 *
 * @return {String|Array<Object>} The formatted data
 */
var get = function get() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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

  switch ([type, styleType].join()) {
    case 'html,citation':
      var useLang = (0, _locales2.default)(lang) ? lang : 'en-US';
      var useTemplate = (0, _styles2.default)(styleFormat);
      var cbItem = (0, _items2.default)(data);

      var citeproc = (0, _engines2.default)(styleFormat, useLang, useTemplate, cbItem, _locales2.default);
      var sortedIds = citeproc.updateItems(this.getIds());

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
          return _this.data.find(function (_ref) {
            var id = _ref.id;
            return id === itemId;
          });
        });
        entries = entries.map(function (element, index) {
          return (0, _attr.getWrappedEntry)(element, sortedItems[index], { append: append, prepend: prepend });
        });
      }

      result = '' + bibStart + entries.join('<br />') + bibEnd;
      break;

    case 'html,csl':
      result = (0, _json4.default)(data);
      break;

    case 'html,bibtex':
      result = (0, _text2.default)(data, true);
      break;

    case 'string,bibtex':
      result = (0, _text2.default)(data, false);
      break;

    case 'html,bibtxt':
      result = (0, _bibtxt2.default)(data, true);
      break;

    case 'string,bibtxt':
      result = (0, _bibtxt2.default)(data, false);
      break;

    case 'string,citation':
      result = (0, _striptags2.default)(this.get(Object.assign({}, options, { type: 'html' })));
      break;

    case 'string,csl':
      result = JSON.stringify(data);
      break;

    case 'json,csl':
      result = JSON.stringify(data);
      break;

    case 'json,bibtex':
    case 'json,bibtxt':
      result = JSON.stringify(data.map(_json2.default));
      break;

    case 'json,citation':
      console.error('[get]', 'Combination type/style of json/citation-* is not valid: ' + type + '/' + style);
      break;

    default:
      console.error('[get]', 'Invalid options');
      break;
  }

  if (format === 'real') {
    if (type === 'json') {
      result = JSON.parse(result);
    } else if (type === 'html' && typeof document !== 'undefined' && document.createElement) {
      var tmp = document.createElement('div');
      tmp.innerHTML = result;
      result = tmp.firstChild;
    }
  }

  return result;
};

exports.getIds = getIds;
exports.get = get;