"use strict";

if (process.env.MOCHA === '1') {
  global.logger = {
    error: function error() {},
    warn: function warn() {},
    info: function info() {}
  };
} else if (typeof console.Console === 'function') {
  global.logger = new console.Console(process.stderr);
} else {
  global.logger = console;
}