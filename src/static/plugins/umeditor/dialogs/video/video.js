import './video.css'
(function () {
    var domUtils = UM.dom.domUtils;
    var widgetName = 'video',
        embedAreaId = 'embed-area';

    UM.registerWidget(widgetName, {

        tpl: "<div class=\"edui-video-wrapper\">" +
            "<div id=\"eduiVideoTab\">" +
            "<div id=\"eduiVideoTabHeads\" class=\"edui-video-tabhead\">" +
            "<span tabSrc=\"video\" class=\"edui-video-focus\"><%=lang_tab_insertV%></span>" +
            "</div>" +
            "<div id=\"eduiVideoTabBodys\" class=\"edui-video-tabbody\">" +
            "<div id=\"eduiVideoPanel\" class=\"edui-video-panel\">" +
            "<table>" +
            "<tr><td colspan='2'><textarea id=\"" + embedAreaId + '"' + " placeholder='嵌入通用代码, 例如<iframe>...</iframe>' type=\"text\"></textarea></td></tr>" +
            "<tr><td><input class='embed-frame-width' placeholder='<%=lang_embedWidth%>' /></td>\<td><input class='embed-frame-height' placeholder='<%=lang_embedHeight%>' /></td></tr>" +
            '</table>' +
            "<div id=\"eduiVideoPreview\"></div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor, $widget) {

            var me = this,
                lang = editor.getLang(widgetName),
                video_url = UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/video/';

            me.lang = lang;
            me.editor = editor;
            me.$widget = $widget;
            me.root().html($.parseTmpl(me.tpl, $.extend({
                video_url: video_url
            }, lang['static'])));

            me.initController(lang);

        },
        /**
         * 初始化事件，
         * 如果输入的通用模板不正确，给出错误提示
         */
        initEvent: function () {

            var me = this,
                textarea = $('#' + embedAreaId, me.$widget);

            // 添加事件
            textarea.on('input', function () {
                var lang = me.lang,
                    preview = $('#eduiVideoPreview', me.$widget);

                preview.html(lang.embedError)
                
                if (!me.checkEmbedTemplate()) {
                    preview.html(lang.embedError)
                } else if (preview.html()) {
                    preview.html('')
                }
            })

        },
        initController: function (lang) {

            var me = this,
                img = me.editor.selection.getRange().getClosedNode(),
                url;

            //编辑视频时初始化相关信息
            if (img && img.className == "edui-faked-video") {
                $('#' + embedAreaId, me.$widget)[0].value = url = img.getAttribute("_url");
                $("#eduiVideoWidth", me.$widget)[0].value = img.width;
                $("#eduiVideoHeight", me.$widget)[0].value = img.height;
                var align = domUtils.getComputedStyle(img, "float"),
                    parentAlign = domUtils.getComputedStyle(img.parentNode, "text-align");
                me.updateAlignButton(parentAlign === "center" ? "center" : align);
            }
            me.checkEmbedTemplate();
        },
        /**
         * 根据url生成视频预览
         * @return {boolean}
         */
        checkEmbedTemplate: function () {
            var me = this,
                content = me.getEmbedTemplate();

            return content ? /^<(iframe|embed)[^>]+>\s*<\/\1>$/.test(content) : true
        },
        /**
         * 获取输入的通用模板
         * @return {string}
         */
        getEmbedTemplate() {
            var template = $('#' + embedAreaId, this.$widget).val(),
                width = $('.embed-frame-width', this.$widget).val(),
                height = $('.embed-frame-height', this.$widget).val(),
                sizePattern = /\d(?=(px||em|rem|%))/

            // 矫正长度单位
            if (!sizePattern.test(width)) {
                width = '750px'
            }
            if (!sizePattern.test(height)) {
                height = '450px'
            }
            
            // 修复优酷通用模板不能全屏显示
            template = template.replace(/\s'allowfullscreen'/, ' allowfullscreen="allowfullscreen" ')

            // 设置iframe的style
            template = template.replaceAll(/style=?('|")[^"']+?('|")/g, '')
                .replace(/(<?(embed|iframe))\s+/, '$1 style="height:' + height + '; width: '+ width +';" ')

            return template
        },
        /**
         * 将单个视频信息插入编辑器中
         */
        // insertSingle: function(){

        //     var me = this,
        //         width = $("#eduiVideoWidth", me.$widget)[0],
        //         height = $("#eduiVideoHeight", me.$widget)[0],
        //         url=$('#eduiVideoUrl', me.$widget)[0].value,
        //         align = this.findFocus("eduiVideoFloat","name");

        //     if(!url) return false;
        //     if ( !me.checkNum( [width, height] ) ) return false;
        //     this.editor.execCommand('insertvideo', {
        //         url: me.convert_url(url),
        //         width: width.value,
        //         height: height.value,
        //         align: align
        //     });

        // },
        /**
         * URL转换
         */
        // convert_url: function(url){
        //     if ( !url ) return '';
        //     var matches = url.match(/youtu.be\/(\w+)$/) ||
        //             url.match(/youtube\.com\/watch\?v=(\w+)/) ||
        //             url.match(/youtube.com\/v\/(\w+)/),
        //         youku = url.match(/youku\.com\/v_show\/id_(\w+)/),
        //         youkuPlay = /player\.youku\.com/ig.test(url);

        //     if(youkuPlay){
        //         url = url.replace(/\?f=.*/, "");
        //     } else if (matches){
        //         url = "https://www.youtube.com/v/" + matches[1] + "?version=3&feature=player_embedded";
        //     }else if(youku){
        //         url = "http://player.youku.com/player.php/sid/"+youku[1]+"/v.swf"
        //     } else {
        //         url = url.replace(/http:\/\/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i, "http://www.tudou.com/v/$1")
        //             .replace(/http:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/i, "http://www.youtube.com/v/$1")
        //             .replace(/http:\/\/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, "http://player.youku.com/player.php/sid/$1")
        //             .replace(/http:\/\/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i, "http://player.56.com/v_$1.swf")
        //             .replace(/http:\/\/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i, "http://player.56.com/v_$1.swf")
        //             .replace(/http:\/\/v\.ku6\.com\/.+\/([^.]+)\.html/i, "http://player.ku6.com/refer/$1/v.swf")
        //             .replace(/\?f=.*/, "");
        //     }
        //     return url;
        // },
        /**
         * 检测传入的所有input框中输入的长宽是否是正数
         */
        checkNum: function checkNum(nodes) {

            var me = this;

            for (var i = 0, ci; ci = nodes[i++];) {
                var value = ci.value;
                if (!me.isNumber(value) && value) {
                    alert(me.lang.numError);
                    ci.value = "";
                    ci.focus();
                    return false;
                }
            }
            return true;
        },
        /**
         * 数字判断
         * @param value
         */
        isNumber: function (value) {
            return /(0|^[1-9]\d*$)/.test(value);
        },
        updateAlignButton: function (align) {
            var aligns = $("#eduiVideoFloat", this.$widget)[0].children;

            for (var i = 0, ci; ci = aligns[i++];) {
                if (ci.getAttribute("name") == align) {
                    if (ci.className != "edui-video-focus") {
                        ci.className = "edui-video-focus";
                    }
                } else {
                    if (ci.className == "edui-video-focus") {
                        ci.className = "";
                    }
                }
            }

        },
        /**
         * 选择切换
         */
        switchSelect: function (selectParentId) {
            var selects = $("#" + selectParentId, this.$widget)[0].children;
            for (var i = 0, ci; ci = selects[i++];) {
                $(ci).on("click", function () {
                    for (var j = 0, cj; cj = selects[j++];) {
                        cj.className = "";
                        cj.removeAttribute && cj.removeAttribute("class");
                    }
                    this.className = "edui-video-focus";
                })
            }
        },
        /**
         * 找到id下具有focus类的节点并返回该节点下的某个属性
         * @param id
         * @param returnProperty
         */
        findFocus: function (id, returnProperty) {
            var tabs = $("#" + id, this.$widget)[0].children,
                property;
            for (var i = 0, ci; ci = tabs[i++];) {
                if (ci.className == "edui-video-focus") {
                    property = ci.getAttribute(returnProperty);
                    break;
                }
            }
            return property;
        },
        /**
         * 末尾字符检测
         */
        endWith: function (str, endStrArr) {
            for (var i = 0, len = endStrArr.length; i < len; i++) {
                var tmp = endStrArr[i];
                if (str.length - tmp.length < 0) return false;

                if (str.substring(str.length - tmp.length) == tmp) {
                    return true;
                }
            }
            return false;
        },
        width: 610,
        height: 300,
        buttons: {
            ok: {
                exec: function (editor, $w) {
                    var widget = editor.getWidgetData(widgetName)

                    if (!widget.checkEmbedTemplate()) {
                        return false
                    }

                    var template = widget.getEmbedTemplate()

                    editor.execCommand('inserthtml', '<div class="embed-video-wrapper" style="text-align: center;">' +  template + '</div>')
                    
                    // function full(ele) {
                    //     if (ele.requestFullscreen) {
                    //         ele.requestFullscreen();
                    //     } else if (ele.mozRequestFullScreen) {
                    //         ele.mozRequestFullScreen();
                    //     } else if (ele.webkitRequestFullscreen) {
                    //         ele.webkitRequestFullscreen();
                    //     } else if (ele.msRequestFullscreen) {
                    //         ele.msRequestFullscreen();
                    //     }
                    // }
                }
            },
            cancel: {
                exec: function () {
                    //清除视频
                    $("#eduiVideoPreview").html("");
                }
            }
        }
    });

})();