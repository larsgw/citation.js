'use strict';

/* global require, module, describe, it, expect */

var Cite = require('./cite');
var testInput = { csl: require('./cite.json') };

module.exports = function () {
  describe('initialisation', function () {
    it('returns a Cite object', function () {
      var test = new Cite();
      expect(test instanceof Cite).toBe(true);
    });
  });

  describe('function', function () {
    describe('add()', function () {
      var test = new Cite(testInput.csl.empty);
      test.add(testInput.csl.empty, true);

      it('works', function () {
        expect(test.data.length).toBe(2);
        expect(test.log.length).toBe(2);
      });
    });

    describe('set()', function () {
      var test = new Cite(testInput.csl.empty);
      test.set(testInput.csl.empty, true);

      it('works', function () {
        expect(test.data.length).toBe(1);
        expect(test.log.length).toBe(2);
      });
    });

    describe('reset()', function () {
      var test = new Cite(testInput.csl.empty);
      test.reset(true);

      it('works', function () {
        expect(test.data.length).toBe(0);
        expect(test.log.length).toBe(2);
      });
    });

    describe('options()', function () {
      var test = new Cite();
      test.options({ format: 'string' }, true);

      it('works', function () {
        expect(test._options.format).toBe('string');
        expect(test.log.length).toBe(2);
      });
    });

    describe('currentVersion()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.currentVersion()).toBe(1);
        test.add(testInput.csl.empty, true);
        expect(test.currentVersion()).toBe(2);
      });
    });

    describe('retrieveVersion()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).toBe(1);
        expect(test.data.length).toBe(1);

        test.add(testInput.csl.empty, true);

        expect(test.log.length).toBe(2);
        expect(test.data.length).toBe(2);

        var test2 = test.retrieveVersion(1);

        expect(test2.log.length).toBe(1);
        expect(test2.data.length).toBe(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).toBe(2);
        expect(test.data.length).toBe(2);
      });
    });

    describe('undo()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).toBe(1);
        expect(test.data.length).toBe(1);

        test.add(testInput.csl.empty, true).save();

        expect(test.log.length).toBe(3);
        expect(test.data.length).toBe(2);

        var test2 = test.undo();

        expect(test2.log.length).toBe(2);
        expect(test2.data.length).toBe(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).toBe(3);
        expect(test.data.length).toBe(2);
      });
    });

    describe('retrieveLastVersion()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).toBe(1);
        expect(test.data.length).toBe(1);

        test.add(testInput.csl.empty, true);

        expect(test.log.length).toBe(2);
        expect(test.data.length).toBe(2);

        var test2 = test.retrieveLastVersion();

        expect(test2.log.length).toBe(2);
        expect(test2.data.length).toBe(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).toBe(2);
        expect(test.data.length).toBe(2);
      });
    });

    describe('save()', function () {
      var test = new Cite(testInput.csl.empty);

      it('works', function () {
        expect(test.log.length).toBe(1);
        expect(test.data.length).toBe(1);

        test.save().add(testInput.csl.empty).save();

        expect(test.log.length).toBe(3);
        expect(test.data.length).toBe(2);

        var test2 = test.undo();

        expect(test2.log.length).toBe(2);
        expect(test2.data.length).toBe(1);
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).toBe(3);
        expect(test.data.length).toBe(2);
      });
    });

    describe('sort()', function () {
      var test = new Cite(testInput.csl.sort);

      it('works', function () {
        expect(test.data[0].author[0].family).toBe('b');
        expect(test.data[1].author[0].family).toBe('a');

        test.sort();

        expect(test.data[0].author[0].family).toBe('a');
        expect(test.data[1].author[0].family).toBe('b');
      });
    });

    describe('getIds()', function () {
      var test = new Cite(testInput.csl.ids);

      it('works', function () {
        expect(test.data[0].id).toBe('b');
        expect(test.data[1].id).toBe('a');

        var out = test.getIds();

        expect(out[0]).toBe('b');
        expect(out[1]).toBe('a');
      });

      it('doesn\'t change parent data', function () {
        expect(test.log.length).toBe(1);
        expect(test.data.length).toBe(2);
      });
    });
  });
};