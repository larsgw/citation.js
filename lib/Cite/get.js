'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _static = require('./static');

var _registrar = require('../get/registrar');

var _json = require('../get/modules/bibtex/json');

var _json2 = _interopRequireDefault(_json);

var _text = require('../get/modules/bibtex/text');

var _text2 = _interopRequireDefault(_text);

var _bibtxt = require('../get/modules/bibtex/bibtxt');

var _bibtxt2 = _interopRequireDefault(_bibtxt);

var _json3 = require('../get/modules/json');

var _csl = require('../parse/csl');

var _csl2 = _interopRequireDefault(_csl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getIds = function getIds() {
  return this.data.map(function (entry) {
    return entry.id;
  });
};

var get = function get() {
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

      result = (0, _registrar.format)('bibliography', data, {
        template: styleFormat,
        lang: lang,
        format: type === 'string' ? 'text' : type,
        append: append,
        prepend: prepend
      });

      break;

    case 'csl':
      if (type === 'html') {
        result = (0, _json3.getJsonWrapper)(data);
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