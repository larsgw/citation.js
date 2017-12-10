"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var templates = {};

var addTemplate = function addTemplate(templateName, template) {
  templates[templateName] = template;
};

var getTemplate = function getTemplate(templateName) {
  return templates[templateName];
};

var hasTemplate = function hasTemplate(templateName) {
  return templates.hasOwnProperty(templateName);
};

var locales = {};

var addLocale = function addLocale(localeName, locale) {
  locales[localeName] = locale;
};

var getLocale = function getLocale(localeName) {
  return locales[localeName];
};

var hasLocale = function hasLocale(localeName) {
  return locales.hasOwnProperty(localeName);
};

exports.addTemplate = addTemplate;
exports.addLocale = addLocale;
exports.getTemplate = getTemplate;
exports.getLocale = getLocale;
exports.hasTemplate = hasTemplate;
exports.hasLocale = hasLocale;