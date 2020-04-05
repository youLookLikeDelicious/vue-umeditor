"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "styleContent", {
  enumerable: true,
  get: function get() {
    return _mathquill["default"];
  }
});
exports["default"] = void 0;

var _mathquill = _interopRequireDefault(require("!!raw-loader!./mathquill.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function formulaTemplate() {
  var style = document.createElement('style');
  style.innerHTML = "html, body, .main{\n      margin: 0;\n      padding: 0;\n      overflow: hidden;\n  }\n  ".concat(_mathquill["default"], "\n");
  var div = document.createElement('div');
  div.innerHTML = "\n    <div class=\"main\">\n        <div class=\"mathquill-editable\"></div>\n    </div>\n";
  var script = document.createElement('script');
  script.innerHTML = "window.$ = parent.$\n        window.mathquillV10 = parent.MathQuillV10\n        window.mathquillV10()\n        window.MQ = parent.MQ\n        $(function(){\n\n            var UM = parent.UM,\n                $iframe = $(getSelfIframe()),\n                editorId = $iframe.parents('.edui-body-container').attr('id'),\n                editor = UM.getEditor(editorId),\n                timer;\n\n            /* \u83B7\u5F97\u5F53\u524D\u516C\u5F0F\u6240\u5728\u7684iframe\u8282\u70B9 */\n            function getSelfIframe(){\n                var iframes = parent.document.getElementsByTagName('iframe');\n                for (var key in iframes) {\n                    if (iframes[key].contentWindow == window) {\n                        return iframes[key];\n                    }\n                }\n                return null;\n            }\n            /* \u83B7\u5F97\u5F53\u524Durl\u4E0A\u7684hash\u5B58\u50A8\u7684\u53C2\u6570\u503C */\n            function getLatex() {\n                return $iframe.attr('data-latex') || '';\n            }\n            /* \u4FDD\u5B58\u573A\u666F */\n            function saveScene(){\n                timer && clearTimeout(timer);\n                timer = setTimeout(function(){\n                    editor.fireEvent('savescene');\n                    editor.fireEvent('contentchange');\n                    editor.fireEvent('selectionchange');\n                    timer = null;\n                }, 300);\n            }\n            /* \u8BBE\u7F6E\u7F16\u8F91\u5668\u53EF\u7F16\u8F91 */\n            function enableEditor(){\n                if(editor.body.contentEditable == 'false') {\n                    editor.setEnabled();\n                }\n            }\n            /* \u8BBE\u7F6E\u7F16\u8F91\u5668\u4E0D\u53EF\u7F16\u8F91 */\n            function disableEditor(){\n                if(editor.body.contentEditable == 'true') {\n                    editor.setDisabled(['undo', 'redo', 'preview', 'formula'], true);\n                }\n            }\n\n            /* \u516C\u5F0F */\n            var Formula = function(){\n                var _this = this,\n                    latex = getLatex();\n\n                this.isFocus = false;\n                this.isDisabled = false;\n\n                $(document).find('div.mathquill-editable').html(latex)\n                /* \u52A0\u8F7D\u516C\u5F0F\u5185\u5BB9 */\n                this.$mathquill = MQ.MathField($(document).find('div.mathquill-editable')[0], {\n                  substituteTextarea: function() {\n                    return document.createElement('textarea');\n                  },\n                  handlers: {\n                    enter: function (mathField) {\n                    }\n                  }\n                });\n                this.$el = $(this.$mathquill.el())\n\n                /* \u8BBE\u7F6E\u6D3B\u52A8\u72B6\u6001\u7684\u516C\u5F0Fiframe */\n                this.$el.on('mousedown', function(){\n                    /* \u7F16\u8F91\u5668\u4E0D\u53EF\u7528\u65F6,\u516C\u5F0F\u4E5F\u4E0D\u53EF\u7528 */\n                    if(_this.disabled) return false;\n\n                    /* \u7B2C\u4E00\u6B21\u70B9\u51FB\u5F53\u524D\u516C\u5F0F,\u8BBE\u7F6E\u516C\u5F0F\u6D3B\u52A8 */\n                    if(!$iframe.hasClass('edui-formula-active')) {\n                        disableEditor();\n                        editor.blur();\n                        editor.$body.find('iframe').not($iframe).each(function(k, v){\n                          try{\n                            v.contentWindow.formula.blur();\n                          } catch {\n                            \n                          }\n                        });\n                        if(_this.$el.find('.cursor').css('display') == 'none') {\n                            _this.refresh();\n                            _this.$mathquill.addClass('hasCursor');\n                        }\n                    }\n                    _this.focus();\n                });\n                editor.addListener('click', function(){\n                    _this.blur();\n                    enableEditor();\n                });\n\n                /* \u91CC\u9762focus,\u7F16\u8F91\u5668\u4E5F\u5224\u65AD\u4E3Afocus */\n                editor.addListener('isFocus', function(){\n                    return _this.isFocus;\n                });\n                /* um\u4E0D\u53EF\u7528,\u516C\u5F0F\u4E5F\u4E0D\u53EF\u7F16\u8F91 */\n                editor.addListener('setDisabled', function(type, except){\n                    if (!(except && except.join(' ').indexOf('formula') != -1) && _this.isDisabled != true ) {\n                        _this.setDisabled();\n                    }\n                });\n                editor.addListener('setEnabled', function(){\n                    if (_this.isDisabled != false) {\n                        _this.setEnabled();\n                    }\n                });\n\n                /* \u8BBE\u7F6E\u66F4\u65B0\u5916\u5C42iframe\u7684\u5927\u5C0F\u548C\u5C5E\u6027 */\n                $(document.body).on('keydown', function(){\n                    _this.updateIframe();\n                }).on('keyup', function(){\n                    _this.updateIframe();\n                });\n\n                /* \u6E05\u9664\u521D\u59CB\u5316\u7684\u9AD8\u4EAE\u72B6\u6001 */\n                this.$el.removeClass('hasCursor');\n\n                /* \u521D\u59CB\u5316\u540E\u5EF6\u8FDF\u5237\u65B0\u5916\u5C42iframe\u5927\u5C0F */\n                setTimeout(function(){\n                    _this.updateIframe();\n                }, 300);\n            };\n\n            Formula.prototype = {\n                focus:function(){\n                    $iframe.addClass('edui-formula-active');\n                    this.isFocus = true;\n                },\n                blur:function(){\n                    $iframe.removeClass('edui-formula-active');\n                    this.removeCursor();\n                    this.isFocus = false;\n                },\n                removeCursor: function(){\n                    this.$el.find('span.cursor').hide();\n                    this.$el.parent().find('.hasCursor').removeClass('hasCursor');\n                },\n                updateIframe: function(){\n                    $iframe.width(this.$el.width()+8).height(this.$el.height()+8);\n                    var latex = $iframe.attr('data-latex'),\n                        newLatex = this.getLatex();\n                    if(latex != newLatex) {\n                        $iframe.attr('data-latex', this.getLatex());\n                        saveScene();\n                    }\n                },\n                insertLatex: function(latex){\n                    this.$mathquill.write(latex);\n                    this.updateIframe();\n                    this.removeCursor();\n                },\n                setLatex: function(latex){\n                    this.$mathquill.latex(latex);\n                    this.updateIframe();\n                },\n                getLatex: function(){\n                    return this.$mathquill.latex();\n                },\n                redraw: function(){\n                    this.$mathquill.mathquill('redraw');\n                },\n                setDisabled: function(){\n                    this.blur();\n                    var latex = this.getLatex();\n                    this.$mathquill.revert().text(latex).mathquill();\n                    this.updateIframe();\n                    this.isDisabled = true;\n                },\n                setEnabled: function(){\n                    this.$mathquill.removeClass('mathquill-rendered-math');\n                    this.refresh();\n                    this.isDisabled = false;\n                },\n                refresh: function(){\n                    var latex = this.getLatex();\n                    this.$mathquill.revert().text(latex).mathquill('editable');\n                    this.updateIframe();\n                }\n            };\n\n            /* \u7ED1\u5B9A\u5230window\u4E0A\uFF0C\u7ED9\u4E0A\u7EA7window\u8C03\u7528 */\n            window.formula = new Formula();\n        });";
  var fragment = document.createDocumentFragment();
  fragment.appendChild(style);
  fragment.appendChild(div);
  fragment.appendChild(script);
  return fragment;
}
/**
 * 处理iframe初次加载事件
 * @param iframe
 */


function initFormulaTemplate(iframe) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var doc = iframe.contentWindow.document || iframe.contentDocument;

  if (doc.body) {
    if ($(doc.body).find('script').length) {
      return;
    }

    if (!doc.body && delay) {
      setTimeout(function () {
        initFormulaTemplate(iframe, false);
      }, 256);
      return;
    }

    doc.body.appendChild(formulaTemplate());
  } else {
    iframe.onload = function () {
      var doc = iframe.contentWindow.document || iframe.contentDocument;

      if ($(doc.body).find('script').length) {
        return;
      }

      doc.body.appendChild(formulaTemplate());
    };
  }
}

var _default = initFormulaTemplate;
exports["default"] = _default;