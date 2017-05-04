'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = undefined;

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _attr = require('../util/attr.js');

var _json = require('../get/bibtex/json');

var _json2 = _interopRequireDefault(_json);

var _text = require('../get/bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _json3 = require('../get/html/json');

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
  if (!nolog) this._log.push({ name: 'getIds' });

  var list = [];

  for (var entryIndex = 0; entryIndex < this.data.length; entryIndex++) {
    list.push(this.data[entryIndex].id);
  }return list;
};

/**
 * Get formatted data from your object. For more info, see [Output](../#output).
 * 
 * @method get
 * @memberof Cite
 * @this Cite
 * 
 * @param {Object} options - The options for the output
 * @param {String} [options.format="real"] - The outputted datatype. Real representation (`"real"`, e.g. DOM Object for HTML, JavaScript Object for JSON) or String representation ( `"string"` )
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
  if (!nolog) this._log.push({ name: 'get', arguments: [options] });

  var _data = JSON.parse(JSON.stringify(this.data)),
      result,
      options = Object.assign({ format: 'real', type: 'json', style: 'csl', lang: 'en-US' }, this._options, { locale: '', template: '' }, options),
      type = options.type.toLowerCase(),
      styleParts = options.style.toLowerCase().split('-'),
      style = styleParts[0],
      styleFormat = styleParts.slice(1).join('-');

  switch (type) {
    case 'html':

      switch (style) {

        case 'citation':
          var cb_locale = !options.locale ? _locales2.default : function () {
            return options.locale;
          },
              cb_item = (0, _items2.default)(_data),
              template = options.template ? options.template : (0, _styles2.default)(styleFormat),
              lang = (0, _locales2.default)(options.lang) ? options.lang : 'en-US',
              citeproc = (0, _engines2.default)(styleFormat, lang, template, cb_item, cb_locale),
              sortIds = citeproc.updateItems(this.getIds(true)),
              bib = citeproc.makeBibliography(),
              start = bib[0].bibstart,
              body = bib[1],
              end = bib[0].bibend;

          for (var i = 0; i < body.length; i++) {
            body[i] = (0, _attr.getPrefixedEntry)(body[i], i, sortIds);
          }

          result = start + body.join('<br />') + end;
          break;

        case 'csl':
          result = (0, _json4.default)(_data);
          break;

        case 'bibtex':
          result = (0, _text2.default)(_data, true);
          break;
      }

      break;

    case 'string':

      switch (style) {

        case 'bibtex':
          result = (0, _text2.default)(_data, false);
          break;

        case 'citation':
          var options = Object.assign({}, options, { type: 'html' });
          result = (0, _striptags2.default)(this.get(options, true));
          break;

        case 'csl':
          result = JSON.stringify(_data);
          break;
      }

      break;

    case 'json':

      switch (style) {

        case 'csl':
          result = JSON.stringify(_data);
          break;

        case 'bibtex':
          result = JSON.stringify(_data.map(_json2.default));
          break;

        case 'citation':
          console.error('[get]', 'Combination type/style of json/citation-* is not valid:', options.type + '/' + options.style);
          result = undefined;
          break;
      }

      break;
  }

  if (options.format === 'real') {
    if (options.type === 'json') result = JSON.parse(result);else if (browserMode && options.type === 'html') {
      var tmp = document.createElement('div');
      tmp.innerHTML = result;
      result = result.childNodes;
    }
  }

  return result;
};

exports.getIds = getIds;
exports.get = get;