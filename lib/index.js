"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _umeditor = _interopRequireDefault(require("./umeditor"));

require("./umeditor-loader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/** */
//* 测试使用
// Vue.use({
//     install (Vue, options) {
//         Vue.component('umeditor', umeditor)
//     }
// })
//*/
var _default = {
  install: function install(Vue, options) {
    Vue.component('umeditor', _umeditor["default"]);
  }
};
exports["default"] = _default;