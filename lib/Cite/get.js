'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _attr = require('../util/attr.js');

var _deepCopy = require('../util/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _json = require('../get/bibtex/json');

var _json2 = _interopRequireDefault(_json);

var _text = require('../get/bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _json3 = require('../get/json');

var _json4 = _interopRequireDefault(_json3);

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
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {String[]} List of IDs
 */
var getIds = function getIds(nolog) {
  if (!nolog) {
    this._log.push({ name: 'getIds' });
  }

  return this.data.map(function (entry) {
    return entry.id;
  });
};

/**
 * Get formatted data from your object. For more info, see [Output](../#output).
 *
 * @method get
 * @memberof Cite
 * @this Cite
 *
 * @param {Object} options - The options for the output
 * @param {String} [options.format="real"] - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation (`"string"`)
 * @param {String} [options.type="json"] - The format of the output. `"string"`, `"html"` or `"json"`
 * @param {String} [options.style="csl"] - The style of the output. See [Output](../#output)
 * @param {String} [options.lang="en-US"] - The language of the output. [RFC 5646](https://tools.ietf.org/html/rfc5646) codes
 * @param {String} [options.locale] - Custom CSL locale for citeproc
 * @param {String} [options.template] - Custom CSL style template for citeproc
 * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
 *
 * @return {String|Object[]} The formatted data
 */
var get = function get(options, nolog) {
  if (!nolog) {
    this._log.push({ name: 'get', arguments: [options] });
  }

  var _data = (0, _deepCopy2.default)(this.data);

  var result = void 0;

  var _Object$assign = Object.assign({ format: 'real', type: 'json', style: 'csl', lang: 'en-US' }, this._options, { locale: '', template: '' }, options),
      format = _Object$assign.format,
      type = _Object$assign.type,
      style = _Object$assign.style,
      lang = _Object$assign.lang,
      locale = _Object$assign.locale,
      template = _Object$assign.template;

  var _style$match = style.match(/^([^-]+)(?:-(.+))?$/),
      _style$match2 = _slicedToArray(_style$match, 3),
      styleType = _style$match2[1],
      styleFormat = _style$match2[2];

  switch ([type, styleType].join()) {
    case 'html,citation':
      var cbLocale = locale ? function () {
        return locale;
      } : _locales2.default;
      var cbItem = (0, _items2.default)(_data);
      var useTemplate = template || (0, _styles2.default)(styleFormat);
      var useLang = (0, _locales2.default)(lang) ? lang : 'en-US';

      var citeproc = (0, _engines2.default)(styleFormat, useLang, useTemplate, cbItem, cbLocale);
      var sortedIds = citeproc.updateItems(this.getIds(true));

      var _citeproc$makeBibliog = citeproc.makeBibliography(),
          _citeproc$makeBibliog2 = _slicedToArray(_citeproc$makeBibliog, 2),
          _citeproc$makeBibliog3 = _citeproc$makeBibliog2[0],
          bibStart = _citeproc$makeBibliog3.bibstart,
          bibEnd = _citeproc$makeBibliog3.bibend,
          bibBody = _citeproc$makeBibliog2[1];

      bibBody = bibBody.map(function (element, index) {
        return (0, _attr.getPrefixedEntry)(element, index, sortedIds);
      });

      result = '' + bibStart + bibBody.join('<br />') + bibEnd;
      break;

    case 'html,csl':
      result = (0, _json4.default)(_data);
      break;

    case 'html,bibtex':
      result = (0, _text2.default)(_data, true);
      break;

    case 'string,bibtex':
      result = (0, _text2.default)(_data, false);
      break;

    case 'string,citation':
      result = (0, _striptags2.default)(this.get(Object.assign({}, options, { type: 'html' }), true));
      break;

    case 'string,csl':
      result = JSON.stringify(_data);
      break;

    case 'json,csl':
      result = JSON.stringify(_data);
      break;

    case 'json,bibtex':
      result = JSON.stringify(_data.map(_json2.default));
      break;

    case 'json,citation':
      console.error('[get]', 'Combination type/style of json/citation-* is not valid: ' + type + '/' + style); //
      break;

    default:
      console.error('[get]', 'Invalid options');
      break;
  }

  if (format === 'real') {
    if (type === 'json') {
      result = JSON.parse(result);
    } else if (document && document.createElement && type === 'html') {
      var tmp = document.createElement('div');
      tmp.innerHTML = result;
      result = result.childNodes;
    }
  }

  return result;
};

exports.getIds = getIds;
exports.get = get;