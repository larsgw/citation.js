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
 * @param {String|String[]} q - Wikidata IDs
 * @param {String} lang - Language
 *
 * @return {String[]} Array with labels of each prop
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
 * Transform property and value from Wikidata format to CSL
 *
 * @access protected
 * @method parseWikidataProp
 *
 * @param {String} prop - Property
 * @param {String|Number} value - Value
 * @param {String} lang - Language
 *
 * @return {String[]} Array with new prop and value
 */
var parseWikidataProp = function parseWikidataProp(prop, value, lang) {
  switch (prop) {
    case 'P50':
    case 'P2093':
      value = value.slice();
      break;

    default:
      value = value.length ? value[0].value : undefined;
      break;
  }

  var rProp = '';
  var rValue = value;

  switch (prop) {
    // Author ( q )
    case 'P50':
      rProp = 'authorQ';
      rValue = value.map(function (_ref) {
        var value = _ref.value,
            qualifiers = _ref.qualifiers;
        return [(0, _name2.default)(fetchWikidataLabel(value, lang)[0]), parseWikidataP1545(qualifiers)];
      });
      break;

    // Author ( s )
    case 'P2093':
      rProp = 'authorS';
      rValue = value.map(function (_ref2) {
        var value = _ref2.value,
            qualifiers = _ref2.qualifiers;
        return [(0, _name2.default)(value), parseWikidataP1545(qualifiers)];
      });
      break;

    // Date
    case 'P580':
    case 'P585':
      rProp = 'accessed';
      rValue = (0, _date2.default)(value);
      break;

    // DOI
    case 'P356':
      rProp = 'DOI';
      break;

    // Instance of
    case 'P31':
      rProp = 'type';
      rValue = (0, _type2.default)(value);

      if (rValue === undefined) {
        console.warn('[set]', 'This entry type is not recognized and therefore interpreted as \'article-journal\': ' + value);
        rValue = 'article-journal';
      }
      break;

    // ISBN 13 & 10
    case 'P212':
    case 'P957':
      rProp = 'ISBN';
      break;

    // Issue
    case 'P433':
      rProp = 'issue';
      break;

    // Journal
    case 'P1433':
      rProp = 'container-title';
      rValue = fetchWikidataLabel(value, lang)[0];
      break;

    // Pages
    case 'P304':
      rProp = 'page';
      break;

    // Print/edition
    case 'P393':
      rProp = 'edition';
      break;

    // Pubdate
    case 'P577':
      rProp = 'issued';
      rValue = (0, _date2.default)(value);
      break;

    // Title
    case 'P1476':
      rProp = 'title';
      break;

    // URL
    case 'P953':
      // (full work available at)
      rProp = 'URL';
      break;

    // Volume
    case 'P478':
      rProp = 'volume';
      break;

    case 'P2860': // Cites
    case 'P921': // Main subject
    case 'P3181': // OpenCitations bibliographic resource ID
    case 'P364': // Original language of work
    case 'P698': // PMID
    case 'P932': // PMCID
    case 'P1104':
      // Number of pages
      // Property ignored
      break;

    default:
      console.info('[set]', 'Unknown property: ' + prop);
      break;
  }

  return [rProp, rValue];
};

exports.default = parseWikidataProp;