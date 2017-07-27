"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Internal custom templates register.
 *
 * @access private
 * @constant templates
 * @default {}
 */
var templates = {};

/**
 * Add a template to the register.
 *
 * @access public
 * @method addTemplate
 *
 * @param {String} templateName - template name (used as 'citation-NAME' in Cite#get() style options)
 * @param {String} template - CSL template string
 */
var addTemplate = function addTemplate(templateName, template) {
  templates[templateName] = template;
};

/**
 * Get a template from the register.
 *
 * @access protected
 * @method getTemplate
 *
 * @param {String} templateName - template name (used as 'citation-NAME' in Cite#get() style options)
 * @return {String} CSL template string
 */
var getTemplate = function getTemplate(templateName) {
  return templates[templateName];
};

/**
 * Check if the register has a template (identified by name).
 *
 * @access protected
 * @method hasTemplate
 *
 * @param {String} templateName - template name (used as 'citation-NAME' in Cite#get() style options)
 * @return {Boolean} true if register has template
 */
var hasTemplate = function hasTemplate(templateName) {
  return templates.hasOwnProperty(templateName);
};

/**
 * Internal custom locales register.
 *
 * @access private
 * @constant locales
 * @default {}
 */
var locales = {};

/**
 * Add a locale to the register.
 *
 * @access public
 * @method addLocale
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @param {String} locale - CSL locale string
 */
var addLocale = function addLocale(localeName, locale) {
  locales[localeName] = locale;
};

/**
 * Get a locale from the register.
 *
 * @access protected
 * @method getLocale
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @return {String} CSL locale string
 */
var getLocale = function getLocale(localeName) {
  return locales[localeName];
};

/**
 * Check if the register has a locale (identified by name).
 *
 * @access protected
 * @method hasLocale
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @return {Boolean} true if register has locale
 */
var hasLocale = function hasLocale(localeName) {
  return locales.hasOwnProperty(localeName);
};

exports.addTemplate = addTemplate;
exports.addLocale = addLocale;
exports.getTemplate = getTemplate;
exports.getLocale = getLocale;
exports.hasTemplate = hasTemplate;
exports.hasLocale = hasLocale;