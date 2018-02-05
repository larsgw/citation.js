"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _syncRequest = _interopRequireDefault(require("sync-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchFile = function fetchFile(url) {
  try {
    return (0, _syncRequest.default)('GET', url).getBody('utf8');
  } catch (e) {
    logger.error('[set]', "File '".concat(url, "' could not be fetched:"), e.message);
    return '[]';
  }
};

var _default = fetchFile;
exports.default = _default;