var derequire = require('derequire')
var through = require('through')

module.exports = function (file) {
  var data = '';
  return through(write, end);

  function write (buf) { data += buf }
  function end () {
      this.queue(derequire(data));
      this.queue(null);
  }
}
