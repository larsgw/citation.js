"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dataAsync", {
  enumerable: true,
  get: function get() {
    return _data.default;
  }
});
Object.defineProperty(exports, "chainAsync", {
  enumerable: true,
  get: function get() {
    return _chain.default;
  }
});
Object.defineProperty(exports, "chainLinkAsync", {
  enumerable: true,
  get: function get() {
    return _chainLink.default;
  }
});
exports.async = void 0;

var _data = _interopRequireDefault(require("./data"));

var _chain = _interopRequireDefault(require("./chain"));

var _chainLink = _interopRequireDefault(require("./chainLink"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var async = {
  data: _data.default,
  chain: _chain.default,
  chainLink: _chainLink.default
};
exports.async = async;