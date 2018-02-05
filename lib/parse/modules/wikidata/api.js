"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _fetchFile.default;
  }
});
Object.defineProperty(exports, "parseAsync", {
  enumerable: true,
  get: function get() {
    return _fetchFileAsync.default;
  }
});
exports.types = exports.scope = void 0;

var _fetchFile = _interopRequireDefault(require("../../../util/fetchFile"));

var _fetchFileAsync = _interopRequireDefault(require("../../../util/fetchFileAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scope = '@wikidata';
exports.scope = scope;
var types = '@wikidata/api';
exports.types = types;