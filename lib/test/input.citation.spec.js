'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global require, module, describe, it, expect */

var Cite = require('./cite');

var test = require('./input.json');
test.input.wd.simple = require('./Q21972834.json');
test.input.wd.author = require('./Q27795847.json');

var testCaseGenerator = function testCaseGenerator(input, type, output) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$exact = _ref.exact,
      exact = _ref$exact === undefined ? false : _ref$exact,
      _ref$callback = _ref.callback,
      callback = _ref$callback === undefined ? function (v) {
    return v;
  } : _ref$callback,
      _ref$link = _ref.link,
      link = _ref$link === undefined ? false : _ref$link;

  return function () {
    var test = link ? Cite.parse.input.chainLink(input) : new Cite(input).data;

    it('handles input type', function () {
      expect(Cite.parse.input.type(input)).toBe(type);
    });

    it('parses input correctly', function () {
      expect(callback(test))[exact ? 'toBe' : 'toEqual'](output);
    });
  };
};

var wikidataTestCaseOptions = {
  exact: true,
  callback: function callback(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 1),
        data = _ref3[0];

    return data.replace(/[&?]origin=\*/, '');
  },
  link: true
};

var doiLinkTestCaseOptions = {
  link: true
};

var doiTestCaseOptions = {
  link: true,
  callback: function callback(_ref4) {
    var title = _ref4.title;
    return title;
  }
};

module.exports = {
  async: function async() {
    describe('with callback', function () {
      it('works', function () {
        return new Promise(function (resolve) {
          Cite.async(test.input.wd.url, function (data) {
            expect(data instanceof Cite).toBe(true);
            expect(data.data[0].wikiId).toBe(test.output.wd.id);
            resolve();
          });
        });
      });

      it('works with options', function () {
        return new Promise(function (resolve) {
          Cite.async([], {}, function (data) {
            expect(data instanceof Cite).toBe(true);
            expect(data.data.length).toBe(0);
            resolve();
          });
        });
      });
    });

    describe('with promise', function () {
      it('works', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Cite.async(test.input.wd.url);

              case 2:
                data = _context.sent;

                expect(data instanceof Cite).toBe(true);
                expect(data.data[0].wikiId).toBe(test.output.wd.id);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      })));

      it('works with options', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Cite.async([], {});

              case 2:
                data = _context2.sent;

                expect(data instanceof Cite).toBe(true);
                expect(data.data.length).toBe(0);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
    });
  },
  input: function input() {
    describe('Wikidata ID', testCaseGenerator(test.input.wd.id, 'string/wikidata', test.output.wd.api[0], wikidataTestCaseOptions));

    describe('Wikidata URL', testCaseGenerator(test.input.wd.url, 'url/wikidata', test.output.wd.api[0], wikidataTestCaseOptions));

    describe('Wikidata ID list', function () {
      describe('separated by spaces', testCaseGenerator(test.input.wd.list.space, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions));

      describe('separated by newlines', testCaseGenerator(test.input.wd.list.newline, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions));

      describe('separated by commas', testCaseGenerator(test.input.wd.list.comma, 'list/wikidata', test.output.wd.api[1], wikidataTestCaseOptions));
    });

    describe('Wikidata JSON', function () {
      testCaseGenerator(test.input.wd.simple, 'object/wikidata', test.output.wd.simple)();

      describe('with linked authors', testCaseGenerator(test.input.wd.author, 'object/wikidata', test.output.wd.author));
    });

    describe('DOI ID', testCaseGenerator(test.input.doi.id, 'string/doi', test.output.doi.api[0], doiLinkTestCaseOptions));

    describe('DOI URL', testCaseGenerator(test.input.doi.url, 'api/doi', test.output.doi.simple.title, doiTestCaseOptions));

    describe('DOI ID list', function () {
      describe('separated by spaces', testCaseGenerator(test.input.doi.list.space, 'list/doi', test.output.doi.api[1], doiLinkTestCaseOptions));

      describe('separated by newlines', testCaseGenerator(test.input.doi.list.newline, 'list/doi', test.output.doi.api[1], doiLinkTestCaseOptions));
    });

    describe('BibTeX string', function () {
      testCaseGenerator(test.input.bibtex.simple, 'string/bibtex', test.output.bibtex.simple)();

      describe('with whitespace and unknown fields', testCaseGenerator(test.input.bibtex.whitespace, 'string/bibtex', test.output.bibtex.whitespace));
    });

    describe('BibTeX JSON', testCaseGenerator(test.input.bibtex.json, 'object/bibtex', test.output.bibtex.simple));

    describe('Bib.TXT string', function () {
      testCaseGenerator(test.input.bibtxt.simple, 'string/bibtxt', [test.output.bibtxt])();

      describe('with multiple entries', testCaseGenerator(test.input.bibtxt.multiple, 'string/bibtxt', [test.output.bibtxt, test.output.bibtex.simple[0]]));

      describe('with whitespace', testCaseGenerator(test.input.bibtxt.whitespace, 'string/bibtxt', [test.output.bibtxt]));
    });

    describe('CSL-JSON', testCaseGenerator(test.input.csl[0], 'object/csl', test.input.csl));
    describe('ContentMine JSON', testCaseGenerator(test.input.bibjson.simple, 'object/contentmine', test.output.bibjson.simple));

    describe('Array', function () {
      var objs = [{ id: 'a' }, { id: 'b' }];

      testCaseGenerator(objs, 'array/csl', objs)();
      it('duplicates objects', function () {
        expect(new Cite(objs).data).not.toBe(objs);
      });

      describe('nested', function () {
        var data = [[objs[0]], objs[1]];

        testCaseGenerator(data, 'array/else', objs)();
        it('duplicates objects', function () {
          var test = new Cite(data).data;

          expect(test[0]).not.toBe(objs[0]);
          expect(test[1]).not.toBe(objs[1]);
        });
      });
    });

    describe('Empty', function () {
      describe('string', function () {
        describe('empty', testCaseGenerator('', 'string/empty', []));
        describe('whitespace', testCaseGenerator('   \t\n \r  ', 'string/whitespace', []));
      });

      describe('null', testCaseGenerator(null, 'empty', []));
      describe('undefined', testCaseGenerator(undefined, 'empty', []));
    });
  }
};