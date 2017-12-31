'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = exports.format = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _static = require('./static');

var _registrar = require('../get/registrar');

var _csl = require('../parse/csl');

var _csl2 = _interopRequireDefault(_csl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getIds = function getIds() {
  return this.data.map(function (entry) {
    return entry.id;
  });
};

var format = function format(_format) {
  for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    options[_key - 1] = arguments[_key];
  }

  return _registrar.format.apply(undefined, [_format, (0, _csl2.default)(this.data)].concat(options));
};

var get = function get() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  try {
    (0, _static.validateOutputOptions)(options);
  } catch (_ref) {
    var message = _ref.message;

    logger.error('[get]', message);
  }

  var parsedOptions = Object.assign({}, this.defaultOptions, this._options.output, options);

  var type = parsedOptions.type,
      style = parsedOptions.style;

  var _style$split = style.split('-'),
      _style$split2 = _slicedToArray(_style$split, 2),
      styleType = _style$split2[0],
      styleFormat = _style$split2[1];

  var newStyle = styleType === 'citation' ? 'bibliography' : styleType === 'csl' ? 'data' : styleType;
  var newType = type === 'string' ? 'text' : type === 'json' ? 'object' : type;

  var formatOptions = void 0;

  switch (newStyle) {
    case 'bibliography':
      var lang = parsedOptions.lang,
          append = parsedOptions.append,
          prepend = parsedOptions.prepend;

      formatOptions = { template: styleFormat, lang: lang, format: newType, append: append, prepend: prepend };
      break;

    case 'data':
    case 'bibtex':
    case 'bibtxt':
      formatOptions = { newType: newType };
      break;

    default:
      logger.error('[get]', 'Invalid options');
      break;
  }

  var result = this.format(newStyle, formatOptions);

  var format = parsedOptions.format;

  if (format === 'real' && newType === 'html' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    var tmp = document.createElement('div');
    tmp.innerHTML = result;
    return tmp.firstChild;
  } else if (format === 'string' && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
    return JSON.stringify(result);
  } else {
    return result;
  }
};

exports.format = format;
exports.getIds = getIds;
exports.get = get;