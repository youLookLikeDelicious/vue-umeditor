
// instrument by jscoverage, do not modifly this file
(function (file, lines, conds, source) {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (BASE._$jscoverage) {
    BASE._$jscmd(file, 'init', lines, conds, source);
    return;
  }
  var cov = {};
  /**
   * jsc(file, 'init', lines, condtions)
   * jsc(file, 'line', lineNum)
   * jsc(file, 'cond', lineNum, expr, start, offset)
   */
  function jscmd(file, type, line, express, start, offset) {
    var storage;
    switch (type) {
      case 'init':
        if(cov[file]){
          storage = cov[file];
        } else {
          storage = [];
          for (var i = 0; i < line.length; i ++) {
            storage[line[i]] = 0;
          }
          var condition = express;
          var source = start;
          storage.condition = condition;
          storage.source = source;
        }
        cov[file] = storage;
        break;
      case 'line':
        storage = cov[file];
        storage[line] ++;
        break;
      case 'cond':
        storage = cov[file];
        storage.condition[line] ++;
        return express;
    }
  }

  BASE._$jscoverage = cov;
  BASE._$jscmd = jscmd;
  jscmd(file, 'init', lines, conds, source);
})('D:/www/npm/vue-umeditor/lib/index.js', [1,3,6,8,10,22,27,12,24], {"12_70_3":0,"12_76_18":0,"12_46_3":0,"12_53_14":0}, ["\"use strict\";","","Object.defineProperty(exports, \"__esModule\", {","  value: true","});","exports[\"default\"] = void 0;","","var _umeditor = _interopRequireDefault(require(\"./umeditor\"));","","require(\"./umeditor-loader\");","","function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }","","/** */","//* 测试使用","// Vue.use({","//     install (Vue, options) {","//         Vue.component('umeditor', umeditor)","//     }","// })","//*/","var _default = {","  install: function install(Vue, options) {","    Vue.component('umeditor', _umeditor[\"default\"]);","  }","};","exports[\"default\"] = _default;"]);
_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 1);

"use strict";

_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 3);

Object.defineProperty(exports, "__esModule", {
    value: true
});

_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 6);

exports["default"] = void 0;

_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 8);

var _umeditor = _interopRequireDefault(require("./umeditor"));

_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 10);

require("./umeditor-loader");

function _interopRequireDefault(obj) {
    _$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 12);
    return _$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "cond", "12_46_3", obj) && _$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "cond", "12_53_14", obj.__esModule) ? _$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "cond", "12_70_3", obj) : _$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "cond", "12_76_18", {
        "default": obj
    });
}

_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 22);

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
        _$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 24);
        Vue.component("umeditor", _umeditor["default"]);
    }
};

_$jscmd("D:/www/npm/vue-umeditor/lib/index.js", "line", 27);

exports["default"] = _default;