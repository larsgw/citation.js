if (process.env.MOCHA === '1') {
  global.logger = {
    error: function error() {},
    warn: function warn() {},
    info: function info() {}
  };
} else {
  global.logger = new console.Console(process.stderr);
}