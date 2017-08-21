"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Generate ID
 *
 * @access protected
 * @method fetchId
 *
 * @param {Array<String>} list - old ID list
 * @param {String} prefix - ID prefix
 *
 * @return {String} CSL ID
 */
var fetchId = function fetchId(list, prefix) {
  var id = void 0;

  while (list.includes(id)) {
    id = "" + prefix + Math.random().toString().slice(2);
  }

  return id;
};

exports.default = fetchId;