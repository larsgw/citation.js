import {Writable} from 'stream'

// If testing from CLI, use noop logger, to not interfere with the mocha reporter
// (see issues #1998, #2107, etc. at https://github.com/mochajs/mocha)
if (process.env.MOCHA === '1') {
  global.logger = new console.Console(new Writable)
} else {
  global.logger = new console.Console(process.stderr)
}
