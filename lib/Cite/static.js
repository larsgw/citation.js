'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var formats = ['real', 'string'];
var types = ['json', 'html', 'string', 'rtf'];
var styles = ['csl', 'bibtex', 'bibtxt', 'citation-*'];
var wrapperTypes = ['string', 'function'];

var validateOutputOptions = function validateOutputOptions(options) {
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
    throw new TypeError('Options not an object!');
  }

  var format = options.format,
      type = options.type,
      style = options.style,
      lang = options.lang,
      append = options.append,
      prepend = options.prepend;


  if (format && !formats.includes(format)) {
    throw new TypeError('Option format ("' + format + '") should be one of: ' + formats);
  } else if (type && !types.includes(type)) {
    throw new TypeError('Option type ("' + type + '") should be one of: ' + types);
  } else if (style && !styles.includes(style) && !/^citation/.test(style)) {
    throw new TypeError('Option style ("' + style + '") should be one of: ' + styles);
  } else if (lang && typeof lang !== 'string') {
    throw new TypeError('Option lang should be a string, but is a ' + (typeof lang === 'undefined' ? 'undefined' : _typeof(lang)));
  } else if (prepend && !wrapperTypes.includes(typeof prepend === 'undefined' ? 'undefined' : _typeof(prepend))) {
    throw new TypeError('Option prepend should be a string or a function, but is a ' + (typeof prepend === 'undefined' ? 'undefined' : _typeof(prepend)));
  } else if (append && !wrapperTypes.includes(typeof append === 'undefined' ? 'undefined' : _typeof(append))) {
    throw new TypeError('Option append should be a string or a function, but is a ' + (typeof append === 'undefined' ? 'undefined' : _typeof(append)));
  }

  if (/^citation/.test(style) && type === 'json') {
    throw new Error('Combination type/style of json/citation-* is not valid: ' + type + '/' + style);
  }

  return true;
};

var validateOptions = function validateOptions(options) {
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
    throw new TypeError('Options not an object!');
  }

  if (options.output) {
    validateOutputOptions(options.output);
  } else if (options.maxChainLength && typeof options.maxChainLength !== 'number') {
    throw new TypeError('Option maxChainLength should be a number');
  } else if (options.forceType && typeof options.forceType !== 'string') {
    throw new TypeError('Option forceType should be a string');
  }

  return true;
};

exports.validateOptions = validateOptions;
exports.validateOutputOptions = validateOutputOptions;