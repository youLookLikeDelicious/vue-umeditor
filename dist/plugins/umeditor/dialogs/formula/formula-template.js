import styleContent from '!!raw-loader!./mathquill.css'

export { styleContent }
function formulaTemplate () {
    const style = document.createElement('style')
    style.innerHTML = `html, body, .main{
      margin: 0;
      padding: 0;
      overflow: hidden;
  }
  ${styleContent}
`

    const div = document.createElement('div')
    div.innerHTML = `
    <div class="main">
        <div class="mathquill-editable"></div>
    </div>
`

    const script = document.createElement('script')
    script.innerHTML = 
        `window.$ = parent.$
        window.mathquillV10 = parent.MathQuillV10
        window.mathquillV10()
        window.MQ = parent.MQ
        $(function(){

            var UM = parent.UM,
                $iframe = $(getSelfIframe()),
                editorId = $iframe.parents('.edui-body-container').attr('id'),
                editor = UM.getEditor(editorId),
                timer;

            /* 获得当前公式所在的iframe节点 */
            function getSelfIframe(){
                var iframes = parent.document.getElementsByTagName('iframe');
                for (var key in iframes) {
                    if (iframes[key].contentWindow == window) {
                        return iframes[key];
                    }
                }
                return null;
            }
            /* 获得当前url上的hash存储的参数值 */
            function getLatex() {
                return $iframe.attr('data-latex') || '';
            }
            /* 保存场景 */
            function saveScene(){
                timer && clearTimeout(timer);
                timer = setTimeout(function(){
                    editor.fireEvent('savescene');
                    editor.fireEvent('contentchange');
                    editor.fireEvent('selectionchange');
                    timer = null;
                }, 300);
            }
            /* 设置编辑器可编辑 */
            function enableEditor(){
                if(editor.body.contentEditable == 'false') {
                    editor.setEnabled();
                }
            }
            /* 设置编辑器不可编辑 */
            function disableEditor(){
                if(editor.body.contentEditable == 'true') {
                    editor.setDisabled(['undo', 'redo', 'preview', 'formula'], true);
                }
            }

            /* 公式 */
            var Formula = function(){
                var _this = this,
                    latex = getLatex();

                this.isFocus = false;
                this.isDisabled = false;

                $(document).find('div.mathquill-editable').html(latex)
                /* 加载公式内容 */
                this.$mathquill = MQ.MathField($(document).find('div.mathquill-editable')[0], {
                  substituteTextarea: function() {
                    return document.createElement('textarea');
                  },
                  handlers: {
                    enter: function (mathField) {
                    }
                  }
                });
                this.$el = $(this.$mathquill.el())

                /* 设置活动状态的公式iframe */
                this.$el.on('mousedown', function(){
                    /* 编辑器不可用时,公式也不可用 */
                    if(_this.disabled) return false;

                    /* 第一次点击当前公式,设置公式活动 */
                    if(!$iframe.hasClass('edui-formula-active')) {
                        disableEditor();
                        editor.blur();
                        editor.$body.find('iframe').not($iframe).each(function(k, v){
                          try{
                            v.contentWindow.formula.blur();
                          } catch {
                            
                          }
                        });
                        if(_this.$el.find('.cursor').css('display') == 'none') {
                            _this.refresh();
                            _this.$mathquill.addClass('hasCursor');
                        }
                    }
                    _this.focus();
                });
                editor.addListener('click', function(){
                    _this.blur();
                    enableEditor();
                });

                /* 里面focus,编辑器也判断为focus */
                editor.addListener('isFocus', function(){
                    return _this.isFocus;
                });
                /* um不可用,公式也不可编辑 */
                editor.addListener('setDisabled', function(type, except){
                    if (!(except && except.join(' ').indexOf('formula') != -1) && _this.isDisabled != true ) {
                        _this.setDisabled();
                    }
                });
                editor.addListener('setEnabled', function(){
                    if (_this.isDisabled != false) {
                        _this.setEnabled();
                    }
                });

                /* 设置更新外层iframe的大小和属性 */
                $(document.body).on('keydown', function(){
                    _this.updateIframe();
                }).on('keyup', function(){
                    _this.updateIframe();
                });

                /* 清除初始化的高亮状态 */
                this.$el.removeClass('hasCursor');

                /* 初始化后延迟刷新外层iframe大小 */
                setTimeout(function(){
                    _this.updateIframe();
                }, 300);
            };

            Formula.prototype = {
                focus:function(){
                    $iframe.addClass('edui-formula-active');
                    this.isFocus = true;
                },
                blur:function(){
                    $iframe.removeClass('edui-formula-active');
                    this.removeCursor();
                    this.isFocus = false;
                },
                removeCursor: function(){
                    this.$el.find('span.cursor').hide();
                    this.$el.parent().find('.hasCursor').removeClass('hasCursor');
                },
                updateIframe: function(){
                    $iframe.width(this.$el.width()+8).height(this.$el.height()+8);
                    var latex = $iframe.attr('data-latex'),
                        newLatex = this.getLatex();
                    if(latex != newLatex) {
                        $iframe.attr('data-latex', this.getLatex());
                        saveScene();
                    }
                },
                insertLatex: function(latex){
                    this.$mathquill.write(latex);
                    this.updateIframe();
                    this.removeCursor();
                },
                setLatex: function(latex){
                    this.$mathquill.latex(latex);
                    this.updateIframe();
                },
                getLatex: function(){
                    return this.$mathquill.latex();
                },
                redraw: function(){
                    this.$mathquill.mathquill('redraw');
                },
                setDisabled: function(){
                    this.blur();
                    var latex = this.getLatex();
                    this.$mathquill.revert().text(latex).mathquill();
                    this.updateIframe();
                    this.isDisabled = true;
                },
                setEnabled: function(){
                    this.$mathquill.removeClass('mathquill-rendered-math');
                    this.refresh();
                    this.isDisabled = false;
                },
                refresh: function(){
                    var latex = this.getLatex();
                    this.$mathquill.revert().text(latex).mathquill('editable');
                    this.updateIframe();
                }
            };

            /* 绑定到window上，给上级window调用 */
            window.formula = new Formula();
        });`

        const fragment = document.createDocumentFragment()
        fragment.appendChild(style)
        fragment.appendChild(div)
        fragment.appendChild(script)

        return fragment
}

/**
 * 处理iframe初次加载事件
 * @param iframe
 */
function initFormulaTemplate (iframe, delay = true) {

    const doc = iframe.contentWindow.document || iframe.contentDocument

    if (doc.body) {
      if ($(doc.body).find('script').length) {
        return
      }
      if (!doc.body && delay) {
        setTimeout(function () {
          initFormulaTemplate(iframe, false)
        }, 256)
        return
      }
      doc.body.appendChild(formulaTemplate())
    } else {
      iframe.onload = function () {
        const doc = iframe.contentWindow.document || iframe.contentDocument

        if ($(doc.body).find('script').length) {
          return
        }
        doc.body.appendChild(formulaTemplate())
    }
  }
}
export default initFormulaTemplate