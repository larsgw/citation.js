"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _syncRequest = _interopRequireDefault(require("sync-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchFile = function fetchFile(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var reqOpts = {};

  if (opts.headers) {
    reqOpts.headers = opts.headers;
    reqOpts.allowRedirectHeaders = Object.keys(opts.headers);
  }

  try {
    return (0, _syncRequest.default)('GET', url, reqOpts).getBody('utf8');
  } catch (e) {
    logger.error('[set]', "File '".concat(url, "' could not be fetched:"), e.message);
    return '[]';
  }
};

var _default = fetchFile;
exports.default = _default;