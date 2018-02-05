"use strict";

var _registrar = require("../registrar/");

require("./native");

var modules = _interopRequireWildcard(require("./modules"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

for (var _module in modules) {
  var _modules$module = modules[_module],
      types = _modules$module.types,
      parsers = _modules$module.parsers;

  for (var type in types) {
    (0, _registrar.add)(type, types[type]);
  }

  var _loop = function _loop(parser) {
    var _parsers$parser = parsers[parser],
        types = _parsers$parser.types,
        parse = _parsers$parser.parse,
        parseAsync = _parsers$parser.parseAsync;
    [].concat(types).forEach(function (type) {
      return (0, _registrar.add)(type, {
        parse: parse,
        parseAsync: parseAsync
      });
    });
  };

  for (var parser in parsers) {
    _loop(parser);
  }
}