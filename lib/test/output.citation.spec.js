'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global require, module, describe, it, expect */

var Cite = require('./cite');
var test = require('./output.json');

var customTemplate = '<?xml version="1.0" encoding="utf-8"?>\n<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">\n  <bibliography>\n    <layout>\n      <text variable="title"/>\n    </layout>\n  </bibliography>\n</style>';
var customLocale = '<?xml version="1.0" encoding="utf-8"?>\n<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="custom">\n  <style-options punctuation-in-quote="true"/>\n  <date form="text">\n    <date-part name="month" suffix=" "/>\n    <date-part name="day" suffix=", "/>\n    <date-part name="year"/>\n  </date>\n  <date form="numeric">\n    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>\n    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>\n    <date-part name="year"/>\n  </date>\n  <terms>\n    <term name="no date" form="short">custom</term>\n  </terms>\n</locale>';

var testCaseGenerator = function testCaseGenerator(data, options, output) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? function (v) {
    return v;
  } : _ref$callback,
      _ref$msg = _ref.msg,
      msg = _ref$msg === undefined ? 'outputs correctly' : _ref$msg;

  return function () {
    var out = callback(data.get(options));
    out = typeof out === 'string' ? out.trim() : out;

    it(msg, function () {
      expect(out)[(typeof out === 'undefined' ? 'undefined' : _typeof(out)) === 'object' ? 'toEqual' : 'toBe'](output);
    });
  };
};

module.exports = function () {
  var data = new Cite(test.input.csl.simple);

  describe('formatted CSL', function () {
    describe('html', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, {
        format: 'string',
        type: 'html',
        style: 'citation-apa'
      }, test.output.csl.html.apa));

      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, {
        format: 'string',
        type: 'html',
        style: 'citation-vancouver'
      }, test.output.csl.html.vancouver));

      describe('custom template', function () {
        var reg = Cite.CSL.register;
        reg.addTemplate('custom', customTemplate);

        it('registers the template', function () {
          expect(reg.hasTemplate('custom')).toBe(true);
          expect(reg.getTemplate('custom')).toBe(customTemplate);
        });

        testCaseGenerator(data, {
          format: 'string',
          type: 'html',
          style: 'citation-custom'
        }, test.output.csl.html.title, { msg: 'uses the template' })();
      });

      describe('custom locale', function () {
        var reg = Cite.CSL.register;
        reg.addLocale('custom', customLocale);

        it('registers the locale', function () {
          expect(reg.hasLocale('custom')).toBe(true);
          expect(reg.getLocale('custom')).toBe(customLocale);
        });

        testCaseGenerator(new Cite({ id: 'a', type: 'article-journal' }), {
          format: 'string',
          type: 'html',
          style: 'citation-apa',
          lang: 'custom'
        }, test.output.csl.html.locale, { msg: 'uses the locale' })();
      });
    });

    describe('plain text', function () {
      describe('default built-in template (APA)', testCaseGenerator(data, {
        format: 'string',
        type: 'string',
        style: 'citation-apa'
      }, test.output.csl.apa));

      describe('non-default built-in template (Vancouver)', testCaseGenerator(data, {
        format: 'string',
        type: 'string',
        style: 'citation-vancouver'
      }, test.output.csl.vancouver));

      describe('custom template', function () {
        var reg = Cite.CSL.register;
        reg.addTemplate('custom', customTemplate);

        it('registers the template', function () {
          expect(reg.hasTemplate('custom')).toBe(true);
          expect(reg.getTemplate('custom')).toBe(customTemplate);
        });

        testCaseGenerator(data, {
          format: 'string',
          type: 'string',
          style: 'citation-custom'
        }, test.output.csl.title, { msg: 'uses the template' })();
      });

      describe('custom locale', function () {
        var reg = Cite.CSL.register;
        reg.addLocale('custom', customLocale);

        it('registers the locale', function () {
          expect(reg.hasLocale('custom')).toBe(true);
          expect(reg.getLocale('custom')).toBe(customLocale);
        });

        testCaseGenerator(new Cite({ id: 'a', type: 'article-journal' }), {
          format: 'string',
          type: 'string',
          style: 'citation-apa',
          lang: 'custom'
        }, '(custom).', { msg: 'uses the locale' })();
      });
    });
  });

  describe('CSL-JSON', function () {
    describe('plain text', testCaseGenerator(data, { format: 'string' }, test.input.csl.simple, { callback: JSON.parse }));
    describe('object', testCaseGenerator(data, undefined, test.input.csl.simple));
  });

  describe('BibTeX', function () {
    describe('plain text', testCaseGenerator(data, {
      format: 'string',
      type: 'string',
      style: 'bibtex'
    }, test.output.bibtex.plain, { callback: function callback(v) {
        return v.replace(/\s+/g, ' ');
      } }));

    describe('JSON', testCaseGenerator(data, { style: 'bibtex' }, test.output.bibtex.json));

    describe('Bib.TXT', testCaseGenerator(data, {
      format: 'string',
      type: 'string',
      style: 'bibtxt'
    }, test.output.bibtex.bibtxt));
  });
};