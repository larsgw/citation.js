'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var validateOutputOptions = function validateOutputOptions(options) {
  var formats = ['real', 'string'];
  var types = ['json', 'html', 'string', 'rtf'];
  var styles = ['csl', 'bibtex', 'bibtxt', 'citation-*'];

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
    throw new TypeError('Option format should be one of: ' + formats);
  } else if (type && !formats.includes(format)) {
    throw new TypeError('Option type should be one of: ' + types);
  } else if (style && !styles.includes(style)) {
    throw new TypeError('Option style should be one of: ' + styles);
  } else if (lang && typeof lang !== 'string') {
    throw new TypeError('Option lang should be a string');
  } else if (prepend && !['string', 'function'].includes(typeof prepend === 'undefined' ? 'undefined' : _typeof(prepend))) {
    throw new TypeError('Option prepend should be a string or a function');
  } else if (append && !['string', 'function'].includes(typeof append === 'undefined' ? 'undefined' : _typeof(append))) {
    throw new TypeError('Option append should be a string or a function');
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