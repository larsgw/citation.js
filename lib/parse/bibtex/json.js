'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Format BibTeX JSON data
 * 
 * @access private
 * @method parseBibTeXJSON
 * 
 * @param {Object[]} data - The input data
 * 
 * @return {CSL[]} The formatted input data
 */
var parseBibTeXJSON = function parseBibTeXJSON(data) {
  var output = [];

  for (var entryIndex = 0; entryIndex < data.length; entryIndex++) {
    var entry = data[entryIndex];

    for (var prop in entry.properties) {
      var val = (0, _prop2.default)(prop, entry.properties[prop]);

      if (val !== undefined) entry[val[0]] = val[1];
    }

    entry.type = (0, _type2.default)(entry.type);
    entry.id = entry.label;

    delete entry.label;
    delete entry.properties;

    output[entryIndex] = entry;
  }

  return output;
};

exports.default = parseBibTeXJSON;