'use strict';

/* global require, describe */
describe('Cite object', require('./cite.citation.spec'));

var inputTests = require('./input.citation.spec');
describe('.async()', inputTests.async);
describe('input', inputTests.input);

describe('output', require('./output.citation.spec'));