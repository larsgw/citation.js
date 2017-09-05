/**
 * @file index.js
 *
 * @projectname Citationjs
 *
 * @author Lars Willighagen
 * @version 0.3.0-13
 * @license
 * Copyright (c) 2015-2017 Lars Willighagen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import 'babel-polyfill'
import deepFreeze from 'deep-freeze'

import * as get from './get/index'
import * as CSL from './CSL/index'
import * as parse from './parse/index'
import * as util from './util/index'
import * as version from './version'
import async from './async/index'
import Cite from './Cite/index'

Object.assign(Cite, {
  async: async,
  get,
  CSL,
  parse,
  util,
  version,
  input: parse.input.chain,
  inputAsync: parse.input.async.chain
})
deepFreeze(Cite)

module.exports = Cite
