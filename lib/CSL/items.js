"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Retrieve CSL item callback function
 *
 * @access protected
 * @method fetchCSLItemCallback
 *
 * @param {Array<CSL>} data - CSL array
 *
 * @return {Cite~retrieveItem} Code to retreive item
 */
var fetchCSLItemCallback = function fetchCSLItemCallback(data) {
  return function (id) {
    return data.find(function (entry) {
      return entry.id === id;
    });
  };
};

exports.default = fetchCSLItemCallback;