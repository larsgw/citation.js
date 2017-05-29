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
 * @access protected
 * @method parseBibTeXJSON
 *
 * @param {Object|Object[]} data - The input data
 *
 * @return {CSL[]} The formatted input data
 */
var parseBibTeXJSON = function parseBibTeXJSON(data) {
  return [].concat(data).map(function (entry) {
    var newEntry = {};

    for (var prop in entry.properties) {
      var oldValue = entry.properties[prop];
      var newValue = (0, _prop2.default)(prop, oldValue);

      if (newValue) {
        newEntry[newValue[0]] = newValue[1];
      }
    }

    newEntry.type = (0, _type2.default)(entry.type);
    newEntry.id = newEntry.label = entry.label;

    return newEntry;
  });
};

exports.default = parseBibTeXJSON;