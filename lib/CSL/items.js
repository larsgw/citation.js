"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Retrieve CSL item callback function
 *
 * @access private
 * @method fetchCSLItemCallback
 *
 * @param {CSL[]} data - CSL array
 *
 * @return {Cite~retrieveItem} Code to retreive item
 */
var fetchCSLItemCallback = function fetchCSLItemCallback(data) {
  var _data = data;

  return function (id) {
    return _data.find(function (entry) {
      return entry.id === id;
    });
  };
};

exports.default = fetchCSLItemCallback;