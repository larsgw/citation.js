/* istanbul ignore else: coverage tools always in testing environment */
if (process.env.TEST_MOCHA === 'true') {
  // If testing from CLI, use noop logger, to not interfere with the mocha reporter
  // (see issues mochajs/mocha#1998, mochajs/mocha#2107, etc.)

  // code only uses these methods, so this should be enough
  global.logger = {error () {}, warn () {}, info () {}}
} else if (typeof console.Console === 'function') {
  // If possible, make a stderr-only console, so that you can redirect the CLI output to a
  // file (see issue #73).
  global.logger = new console.Console(process.stderr)
} else {
  // Else a browser environment is assumed. This should hold for all supported Node
  // versions, which is >= v6
  global.logger = console
}
