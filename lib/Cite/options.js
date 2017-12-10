'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = exports.options = undefined;

var _static = require('./static');

var defaultOptions = { format: 'real', type: 'json', style: 'csl', lang: 'en-US' };

var options = function options(_options, log) {
  if (log) {
    this.save();
  }

  try {
    (0, _static.validateOptions)(_options);
  } catch (_ref) {
    var message = _ref.message;

    logger.warn('[options]', message);
  } finally {
    Object.assign(this._options, _options);

    return this;
  }
};

exports.options = options;
exports.defaultOptions = defaultOptions;