'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Format Wikidata data
 * 
 * @access private
 * @method parseWikidataJSON
 * 
 * @param {Object} data - The input data
 * 
 * @return {CSL[]} The formatted input data
 */
var parseWikidataJSON = function parseWikidataJSON(data) {
  var output = [],
      entities = data.entities,
      entKeys = Object.keys(entities);

  for (var entIndex = 0; entIndex < entKeys.length; entIndex++) {
    var entKey = entKeys[entIndex],
        labels = entities[entKey].labels,
        entity = _wikidataSdk2.default.simplifyClaims(entities[entKey].claims, null, null, true);

    var json = { wikiID: entKey, id: entKey },
        props = Object.keys(entity);

    for (var propIndex = 0; propIndex < props.length; propIndex++) {
      var prop = props[propIndex],
          value = entity[prop];

      var resp = (0, _prop2.default)(prop, value, 'en');

      if (resp[0].length > 0) json[resp[0]] = resp[1];
    }

    // It still has to combine authors from string value and numeric-id value :(
    if (json.hasOwnProperty('authorQ') || json.hasOwnProperty('authorS')) {

      if (json.hasOwnProperty('authorQ') && json.hasOwnProperty('authorS')) {
        json.author = json.authorQ.concat(json.authorS);

        delete json.authorQ;
        delete json.authorS;
      } else if (json.hasOwnProperty('authorQ')) {
        json.author = json.authorQ;
        delete json.authorQ;
      } else if (json.hasOwnProperty('authorS')) {
        json.author = json.authorS;
        delete json.authorS;
      }

      json.author = json.author.sort(function sortNames(a, b) {
        return a[1] - b[1];
      }).map(function mapNames(v) {
        return v[0];
      });
    }

    if (!(json.hasOwnProperty('title') && json.title)) json.title = labels['en'].value;

    output.push(json);
  }

  return output;
};

exports.default = parseWikidataJSON;