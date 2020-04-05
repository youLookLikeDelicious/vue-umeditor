"use strict";

var _template = _interopRequireDefault(require("./template.html"));

require("./assets/styles/base.css");

require("./assets/styles/ui.css");

require("./assets/styles/scrollbar.css");

require("./assets/js/kitygraph.all.js");

require("./assets/js/kity-formula-render.all.js");

require("./assets/js/kity-formula-parser.all.min.js");

require("./assets/js/kityformula-editor.all.min.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

UM.registerWidget('formula', {
  tpl: '<frameset><frame src="">' + _template["default"] + '</frame></frameset>',
  initContent: function initContent(editor, $dialog) {
    var lang = editor.getLang('formula')["static"],
        opt = $.extend({}, lang, {
      code_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/kity-formula/'
    });

    if (lang) {
      var html = $.parseTmpl(this.tpl, opt);
    } // currentDialog = $dialog.edui();


    this.root().html(html);
  },
  initEvent: function initEvent(editor, $w) {}
});