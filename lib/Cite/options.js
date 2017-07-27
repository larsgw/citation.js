'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO docs
var defaultOptions = { format: 'real', type: 'json', style: 'csl', lang: 'en-US'

  /**
   * Change the default options of a `Cite` object.
   *
   * @method options
   * @memberof Cite
   * @this Cite
   *
   * @param {Object} options - The options for the output. See [input options](../#citation.cite.in.options)
   * @param {Boolean} [log=false] - Show this call in the log
   *
   * @return {Cite} The updated parent object
   */
};var options = function options(_options, log) {
  if (log) {
    this.save();
  }

  Object.assign(this._options, _options);

  return this;
};

exports.options = options;
exports.defaultOptions = defaultOptions;