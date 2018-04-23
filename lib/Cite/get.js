"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.getIds = exports.format = void 0;

var _static = require("./static");

var _registrar = require("../get/registrar");

var _parse = require("../parse/");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getIds = function getIds() {
  return this.data.map(function (entry) {
    return entry.id;
  });
};

exports.getIds = getIds;

var format = function format(_format) {
  for (var _len = arguments.length, options = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    options[_key - 1] = arguments[_key];
  }

  return _registrar.format.apply(void 0, [_format, (0, _parse.csl)(this.data)].concat(options));
};

exports.format = format;

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
  var formatOptions;

  switch (newStyle) {
    case 'bibliography':
      var lang = parsedOptions.lang,
          append = parsedOptions.append,
          prepend = parsedOptions.prepend;
      formatOptions = {
        template: styleFormat,
        lang: lang,
        format: newType,
        append: append,
        prepend: prepend
      };
      break;

    case 'data':
    case 'bibtex':
    case 'bibtxt':
      formatOptions = {
        type: newType
      };
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
  } else if (format === 'string' && _typeof(result) === 'object') {
    return JSON.stringify(result);
  } else {
    return result;
  }
};

exports.get = get;