"use strict";

// 修复IE8下 Array 不支持indexOf方法
(function () {
  if (Array.prototype.indexOf === undefined) {
    Array.prototype.indexOf = function (obj) {
      if (Object.prototype.toString(this) !== '[object Array]') {
        return -1;
      }

      var pos = 0,
          len = this.length;

      for (; pos < len; pos++) {
        if (this[pos] === obj) return pos;
      }

      return pos == len ? -1 : pos;
    };
  }
})();