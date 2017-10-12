'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global jQuery, HTMLElement */

var scope = exports.scope = '@else';
var parsers = exports.parsers = {};
var types = exports.types = {
  '@empty/text': {
    dataType: 'String',
    parseType: function parseType(input) {
      return input === '';
    }
  },
  '@empty/whitespace+text': {
    dataType: 'String',
    parseType: /^\s+$/
  },
  '@empty': {
    dataType: 'Primitive',
    parseType: function parseType(input) {
      return input === null || input === undefined;
    }
  },
  '@else/json': {
    dataType: 'String',
    parseType: /^\s*(\{[\S\s]+\}|\[[\S\s]*\])\s*$/
  },
  '@else/url': {
    dataType: 'String',
    parseType: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost)(:\d+)?(\/[-a-z\d%_.~+:]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  },
  '@else/jquery': {
    dataType: 'ComplexObject',
    parseType: function parseType(input) {
      return typeof jQuery !== 'undefined' && input instanceof jQuery;
    }
  },
  '@else/html': {
    dataType: 'ComplexObject',
    parseType: function parseType(input) {
      return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
    }
  }
};