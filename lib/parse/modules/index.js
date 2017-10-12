'use strict';

var _register = require('../register');

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

for (var _module in modules) {
  var _modules$module = modules[_module],
      types = _modules$module.types,
      parsers = _modules$module.parsers;


  for (var type in types) {
    (0, _register.add)(type, types[type]);
  }

  var _loop = function _loop(parser) {
    var _parsers$parser = parsers[parser],
        types = _parsers$parser.types,
        parse = _parsers$parser.parse,
        parseAsync = _parsers$parser.parseAsync;
    [].concat(types).forEach(function (type) {
      return (0, _register.add)(type, { parse: parse, parseAsync: parseAsync });
    });
  };

  for (var parser in parsers) {
    _loop(parser);
  }
}