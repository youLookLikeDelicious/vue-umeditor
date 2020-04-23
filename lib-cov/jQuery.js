
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
})('D:/www/npm/vue-umeditor/lib/jQuery.js', [1,3,7,5], {"5_70_3":0,"5_76_18":0,"5_46_3":0,"5_53_14":0}, ["\"use strict\";","","var _jquery = _interopRequireDefault(require(\"jquery\"));","","function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }","","window.jQuery = window.$ = _jquery[\"default\"];"]);
_$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "line", 1);

"use strict";

_$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "line", 3);

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) {
    _$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "line", 5);
    return _$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "cond", "5_46_3", obj) && _$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "cond", "5_53_14", obj.__esModule) ? _$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "cond", "5_70_3", obj) : _$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "cond", "5_76_18", {
        "default": obj
    });
}

_$jscmd("D:/www/npm/vue-umeditor/lib/jQuery.js", "line", 7);

window.jQuery = window.$ = _jquery["default"];