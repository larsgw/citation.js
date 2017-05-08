'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Format Wikidata data
 *
 * @access protected
 * @method parseWikidataJSON
 *
 * @param {Object} data - The input data
 *
 * @return {CSL[]} The formatted input data
 */
var parseWikidataJSON = function parseWikidataJSON(data) {
  return Object.keys(data.entities).map(function (entityKey) {
    var _data$entities$entity = data.entities[entityKey],
        labels = _data$entities$entity.labels,
        claims = _data$entities$entity.claims;

    var entity = _wikidataSdk2.default.simplifyClaims(claims, null, null, true);
    var json = {
      wikiId: entityKey,
      id: entityKey
    };

    Object.keys(entity).forEach(function (prop) {
      var value = entity[prop];

      var _parseWikidataProp = (0, _prop2.default)(prop, value, 'en'),
          _parseWikidataProp2 = _slicedToArray(_parseWikidataProp, 2),
          resProp = _parseWikidataProp2[0],
          resValue = _parseWikidataProp2[1];

      if (resProp.length > 0) {
        json[resProp] = resValue;
      }
    });

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
      json.author = json.author.sort(function (a, b) {
        return a[1] - b[1];
      }).map(function (v) {
        return v[0];
      });
    }

    if (!json.title) {
      json.title = labels['en'].value;
    }

    return json;
  });
};

exports.default = parseWikidataJSON;