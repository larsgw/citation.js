"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Register = function () {
  function Register() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Register);

    this.data = data;
  }

  _createClass(Register, [{
    key: "set",
    value: function set(key, value) {
      this.data[key] = value;
      return this;
    }
  }, {
    key: "add",
    value: function add() {
      return this.set.apply(this, arguments);
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      delete this.data[key];
      return this;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.data[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.data.hasOwnProperty(key);
    }
  }, {
    key: "list",
    value: function list() {
      return Object.keys(this.data);
    }
  }]);

  return Register;
}();

var _default = Register;
exports.default = _default;