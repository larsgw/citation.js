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
 * @return {Array<CSL>} The formatted input data
 */
var parseWikidataJSON = function parseWikidataJSON(data) {
  return Object.keys(data.entities).map(function (entityKey) {
    var _data$entities$entity = data.entities[entityKey],
        labels = _data$entities$entity.labels,
        claims = _data$entities$entity.claims;

    var entity = _wikidataSdk2.default.simplifyClaims(claims, null, null, true);
    var json = {
      _wikiId: entityKey,
      id: entityKey
    };

    Object.keys(entity).forEach(function (prop) {
      var field = (0, _prop2.default)(prop, entity[prop], 'en');
      if (field) {
        var _field = _slicedToArray(field, 2),
            fieldName = _field[0],
            fieldValue = _field[1];

        if (Array.isArray(json[fieldName])) {
          json[fieldName] = json[fieldName].concat(fieldValue);
        } else if (fieldValue !== undefined) {
          json[fieldName] = fieldValue;
        }
      }
    });

    if (Array.isArray(json.author)) {
      json.author.sort(function (_ref, _ref2) {
        var a = _ref._ordinal;
        var b = _ref2._ordinal;
        return a - b;
      });
    }

    if (!json.title) {
      json.title = labels['en'].value;
    }

    return json;
  });
};

exports.default = parseWikidataJSON;