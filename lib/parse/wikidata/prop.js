'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wikidataSdk = require('wikidata-sdk');

var _wikidataSdk2 = _interopRequireDefault(_wikidataSdk);

var _fetchFile = require('../../util/fetchFile');

var _fetchFile2 = _interopRequireDefault(_fetchFile);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _date = require('../date');

var _date2 = _interopRequireDefault(_date);

var _name = require('../name');

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get the names of objects from Wikidata IDs
 *
 * @access private
 * @method fetchWikidataLabel
 *
 * @param {String|Array<String>} q - Wikidata IDs
 * @param {String} lang - Language
 *
 * @return {Array<String>} Array with labels of each prop
 */
var fetchWikidataLabel = function fetchWikidataLabel(q, lang) {
  var ids = Array.isArray(q) ? q : typeof q === 'string' ? q.split('|') : '';
  var url = _wikidataSdk2.default.getEntities(ids, [lang], 'labels');
  var entities = JSON.parse((0, _fetchFile2.default)(url)).entities || {};

  return Object.keys(entities).map(function (entityKey) {
    return (entities[entityKey].labels[lang] || {}).value;
  });
};

/**
 * Get series ordinal from qualifiers object
 *
 * @access private
 * @method parseWikidataProp
 *
 * @param {Object} qualifiers - qualifiers object
 *
 * @return {Number} series ordinal or -1
 */
var parseWikidataP1545 = function parseWikidataP1545(qualifiers) {
  return qualifiers.P1545 ? parseInt(qualifiers.P1545[0]) : -1;
};

/**
 * Map holding information on Wikidata fields.
 *
 *  * If false, field should be ignored
 *  * If string, use as field name
 *
 * @access private
 * @constant propMap
 * @default
 */
var propMap = {
  P31: 'type',
  P50: 'author',
  P57: 'director',
  P86: 'composer',
  P98: 'editor',
  P110: 'illustrator',
  P123: 'publisher',
  P136: 'genre',
  P212: 'ISBN',
  P236: 'ISSN',
  P291: 'publisher-place',
  P304: 'page',
  P348: 'version',
  P356: 'DOI',
  P393: 'edition',
  P433: 'issue',
  P478: 'volume',
  P577: 'issued',
  P655: 'translator',
  P698: 'PMID',
  P932: 'PMCID',
  P953: 'URL',
  P957: 'ISBN',
  P1104: 'number-of-pages',
  P1433: 'container-title',
  P1476: 'title',
  P2093: 'author',

  // ignore
  P2860: false, // Cites
  P921: false, // Main subject
  P3181: false, // OpenCitations bibliographic resource ID
  P364: false // Original language of work


  /**
   * Transform property and value from Wikidata format to CSL.
   *
   * Returns additional _ordinal property on authors.
   *
   * @access protected
   * @method parseWikidataProp
   *
   * @param {String} name - Property name
   * @param {String|Number} [value] - Value
   * @param {String} [lang] - Language
   *
   * @return {Array<String>|String} Array with new prop and value or just the prop when function is called without value
   */
};var parseWikidataProp = function parseWikidataProp(name, value, lang) {
  if (!propMap.hasOwnProperty(name)) {
    console.info('[set]', 'Unknown property: ' + name);
    return undefined;
  } else if (propMap[name] === false) {
    return undefined;
  }

  var cslProp = propMap[name];

  if (!value) {
    return cslProp;
  }

  var cslValue = function (prop, valueList) {
    var value = valueList[0].value;

    switch (prop) {
      case 'P31':
        var type = (0, _type2.default)(value);

        if (!type) {
          console.warn('[set]', 'Wikidata entry type not recognized: ' + value + '. Defaulting to "book".');
          return 'book';
        }

        return type;

      case 'P50':
      case 'P57':
      case 'P86':
      case 'P98':
      case 'P110':
      case 'P655':
        return valueList.map(function (_ref) {
          var value = _ref.value,
              qualifiers = _ref.qualifiers;

          var name = (0, _name2.default)(fetchWikidataLabel(value, lang)[0]);
          name._ordinal = parseWikidataP1545(qualifiers);
          return name;
        });

      case 'P577':
        return (0, _date2.default)(value);

      case 'P123':
      case 'P136':
      case 'P291':
      case 'P1433':
        return fetchWikidataLabel(value, lang)[0];

      case 'P2093':
        return valueList.map(function (_ref2) {
          var value = _ref2.value,
              qualifiers = _ref2.qualifiers;

          var name = (0, _name2.default)(value);
          name._ordinal = parseWikidataP1545(qualifiers);
          return name;
        });

      default:
        return value;
    }
  }(name, value);

  return [cslProp, cslValue];
};

exports.default = parseWikidataProp;