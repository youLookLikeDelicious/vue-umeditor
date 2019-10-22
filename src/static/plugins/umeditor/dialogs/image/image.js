(function () {
    var utils = UM.utils,
        browser = UM.browser,
        Base = {
            supportPreview: ImgPreview.prototype.supportPreview,
            allowAsyn: true,
            imgPreView: null,
            fileList: [],
            tmpFileInput: [],
            inputs: [],
            checkURL: function (url) {
                if (!url) {
                    return false
                }
                url = utils.trim(url)
                if (url.length <= 0) {
                    return false
                }
                if (url.search(/http:\/\/|https:\/\//) !== 0) {
                    url += 'http://'
                }

                url = url.replace(/\?[\s\S]*$/, '')

                if (!/(.gif|.jpg|.jpeg|.png)$/i.test(url)) {
                    return false
                }
                return url
            },
            getAllPic: function (sel, $w, editor) {
                var me = this,
                    arr = [],
                    $imgs = $(sel, $w)

                $.each($imgs, function (index, node) {
                    $(node).removeAttr('width').removeAttr('height')
//                if (node.width > editor.options.initialFrameWidth) {
//                    me.scale(node, editor.options.initialFrameWidth -
//                        parseInt($(editor.body).css("padding-left"))  -
//                        parseInt($(editor.body).css("padding-right")));
//                }
                    return arr.push({
                        'width': 200,
                        'src': node.src,
                        'data_id': node.getAttribute('data-id')
                    })
                })

                return arr
            },
            scale: function (img, max, oWidth, oHeight) {
                var width = 0, height = 0, percent, ow = img.width || oWidth, oh = img.height || oHeight
                if (ow > max || oh > max) {
                    if (ow >= oh) {
                        if (width = ow - max) {
                            percent = (width / ow).toFixed(2)
                            img.height = oh - oh * percent
                            img.width = max
                        }
                    } else {
                        if (height = oh - max) {
                            percent = (height / oh).toFixed(2)
                            img.width = ow - ow * percent
                            img.height = max
                        }
                    }
                }

                return this
            },
            close: function ($img) {
                $img.css({
                    top: ($img.parent().height() - $img.height()) / 2,
                    left: ($img.parent().width() - $img.width()) / 2
                }).prev().on('click', function () {
                    // 获取当前位置
                    var pos = this.getAttribute('id')
                    if ($(this).parent().remove().hasClass('edui-image-upload-item')) {
                        var imgs = $('.edui-image-close')
                        // 删除fileinput中对应的元素
                        Base.tmpFileInput.splice(pos, 1)
                        // 重新对img的id属性排序
                        // 获取img元素
                        for (var i = 0, len = imgs.length; i < len; i++) {
                            imgs[i].setAttribute('id', i)
                        }

                        //显示图片计数-1
                        Upload.showCount--
                        Upload.updateView()
                    }

                })
                return this
            },
            // 实例化imgPreView对象
            generatePreView: function (ele) {
                this.imgPreView = ImgPreview(ele, this.callback)
            },
            preView: function (url) {
                var $w = $('#edui-dialog-image')	// 添加图片时，弹出的对话框

                var $img = $('<img src=\'' + url + '\' class=\'edui-image-pic\' data-id=\'' + Upload.showCount + '\' />'),
                    $item = $('<div class=\'edui-image-item edui-image-upload-item\'><div class=\'edui-image-close\'></div></div>').append($img)

                //显示图片计数+1
                Upload.showCount++

                if ($('.edui-image-upload2', $w).length < 1) {
                    $('.edui-image-content', $w).append($item)

                    Upload.render('.edui-image-content', 2).config('.edui-image-upload2')
                } else {
                    $('.edui-image-upload2', $w).before($item).show()
                }

                $img.on('load', function () {
                    Base.scale(this, 120)
                    Base.close($(this))
                    $('.edui-image-content', $w).focus()
                })

                Upload.toggleMask()
            },
            // 回调函数
            // @param mixed data[File|string|array]
            callback: function (data) {
                var url = data

                Upload.toggleMask('Loading....')

                // 拖拽的时候，将file推入栈中
                if (Object.prototype.toString.call(data) === '[object File]') {
                    Base.tmpFileInput.push(data)
                    url = ImgPreview.prototype.createObjectURL(data)
                } else if (typeof data === 'string') {
                    // 当通过input选择图片的时候
                    Base.tmpFileInput.push(this.fileList)
                }

                if (url) {
                    // 有文件上传且文件是图片
                    Base.preView(url)
                } else {
                    Upload.toggleMask()
                    currentDialog.showTip('FALSE')
                    window.setTimeout(function () {
                        currentDialog.hideTip()
                        Upload.toggleMask()		// 显示input 标签
                    }, 3000)
                }
                // 2、更新input的值
                Upload.updateInput()
            },
            // 将新添加的图片推入栈中
            pushFiles: function () {
                var tmp = this.tmpFileInput,
                    fileList = this.fileList,
                    i = 0, len = tmp.length

                if (!len) {
                    return
                }
                // 拷贝Base.tmpFileInput 的files属性值 到Base.fileList
                for (i = 0, len = tmp.length; i < len; i++) {
                    fileList.push(tmp[i])
                }
            }
        }

    /*
     * 本地上传
     * */
    var Upload = {
        isInit: false,
        showCount: 0,
        uploadTpl: '<div class="edui-image-upload%%">' +
            '<span class="edui-image-icon"></span>' +
            '<form class="edui-image-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus name="upfile[]" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/>' +
            '</form>' +
            '</div>',
        init: function (editor, $w) {
            var me = this
            Base.inputs.length = 0
            me.editor = editor
            me.dialog = $w
            me.render('.edui-image-local', 1)
            me.config('.edui-image-local')
            me.submit()
            me.drag()

            $('.edui-image-upload1').hover(function () {
                $('.edui-image-icon', this).toggleClass('hover')
            })

            if (!(UM.browser.ie && UM.browser.version <= 9)) {
                $('.edui-image-dragTip', me.dialog).css('display', 'block')
            }

            return me
        },
        // 追加一个form
        render: function (sel, t) {
            var me = this

            $(sel, me.dialog).append($(me.uploadTpl.replace(/%%/g, t)))
            // 当input更改时，获取imgurl
            Base.generatePreView($('.edui-image-file')[0])
            return me
        },
        config: function (sel) {
            var me = this,
                url = me.editor.options.imageUrl

            url = url + (url.indexOf('?') == -1 ? '?' : '&') + 'editorid=' + me.editor.id//初始form提交地址;
            if (window.UMEDITOR_CONFIG['allowSyn'] && !Base.supportPreview) {
                $(sel).find('.edui-image-form').attr('action', window.UMEDITOR_CONFIG['imageUrl'] + '?' + encodeURI('callback=window.parent.imgBase.imgPreView.asynCallback'))
            }

            return me
        },
        getFileFormDate: function () {
            // Dataform方式
            var formData = new FormData(),
                imgs = $('#' + UM.umId).find('img'),
                i = 0, len = imgs.length,
                id,
                flag = false

            for (; i < len; i++) {
                if (imgs[i].id != '') {
                    id = imgs[i].id.toString()
                    formData.append('upfile[]', Base.fileList[id])
                    formData.append('id[]', id)
                    if (flag !== true) {
                        flag = true
                    }
                }
            }

            return flag ? formData : null
        },
        replaceImageUrl: function (url) {
            var imgs = $('#' + UM.umId).find('img'),
                i = 0, len = imgs.length,
                myEditor = Upload.editor.textarea

            // 替换UM的innerHTML
            for (; i < len; i++) {
                if (imgs[i].id !== '') {
                    imgs[i].src = url[imgs[i].id]
                    imgs[i].removeAttribute('id')
                }
            }
        },
        // 上传文件(图片)， 异步提交
        uploadFile: function (pForm) {
            var inputs = [], data_id,
                myEditor = $('#' + UM.umId),
                imgs = myEditor.find('img'),		 	// 获取文本中的图片
                url = window.UMEDITOR_CONFIG['imageUrl'] // 上传路径

            if (imgs.length == 0) {
                return
            }

            // Dataform方式
            var formData = new FormData()
            for (; i < len; i++) {
                data_id = parseInt(imgs[i].getAttribute('id'))
                formData.append('upfile[]', Base.fileList[data_id])
            }
            $.ajax({
                'url': url,
                'data': formData,
                'type': 'POST',
                'dataType': 'json',
                'processData': false,
                'contentType': false,
                'success': function (data) {
                    // 图片上传成功,替换图片路径，提交form表单
                    if (data['state'] == 'SUCCESS') {
                        var url = data['url'],
                            i = 0, len = url.length,
                            myEditor = Upload.editor.textarea,
                            str = myEditor.value
                        // 替换UM的innerHTML
                        for (; i < len; i++) {
                            str = str.replace(imgs[i].getAttribute('_src'), url[i])
                        }

                        myEditor.value = str

                        pForm.setAttribute('data-hook', '1')
                        pForm.submit()
                    } else {
                        // 上传失败
                        pForm.setAttribute('data-hook', '0')
                        alert(data['state'])
                    }
                    // 清空fileinput
                    Base.fileList.length = 0
                }
            })
        },
        submit: function () {
            var me = this,
                input = $('<input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus="" name="upfile[]" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">'),
                input = input[0], tmpInput

            // 只执行一次
            if (!this.isInit) {
                this.isInit = true

                // 设置form提交时的事件
                var form = $('.edui-image-file')[0].parentElement
                do {
                    form = form.parentElement
                } while (form.tagName != 'FORM')

                form.setAttribute('data-hook', '0')
                // 先提交图片，再提交form表单,如果使用异步提交达到预览效果，则不用对提交数据进行处理
                if (Base.supportPreview) {
                    $(form).on('submit', function (event) {
                            if (this.getAttribute('data-hook') == '0') {
                                // 使用异步提交实现预览效果，无需再进行文件提交
                                event.preventDefault()
                                Upload.uploadFile(this)
                            }
                        }
                    )
                } else {
                    $(form).on('submit', function (event) {
                        // 处理文本内容
                        $('#umeditor_textarea_myEditor')[0].innerText = $('#myEditor').html()
                        this.submit()
                    })
                }
            }

            return me
        },
        //更新input, 将其值设为空即可
        updateInput: function () {
            var upload1 = $('.edui-image-upload1'),
                upload2 = $('.edui-image-upload2'),
                input1 = $('<input style="filter: alpha(opacity=0);" type="file" hidefocus="" name="upfile[]" class="edui-image-file"  accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">'),
                input2 = $('<input style="filter: alpha(opacity=0);" type="file" hidefocus="" name="upfile[]" class="edui-image-file"  accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">')

            upload1.find('.edui-image-file').replaceWith(input1)
            upload2.find('.edui-image-file').replaceWith(input2)

            if (upload1[0].style.display != 'none') {
                Base.generatePreView(input1[0])
            } else {
                Base.generatePreView(input2[0])
            }
        },
        //更新上传框
        updateView: function () {

            if (Upload.showCount !== 0) {
                return
            }

            // 更改图片预览的源
            Base.generatePreView($('.edui-image-file')[1])
            $('.edui-image-upload2', this.dialog).hide()
            $('.edui-image-dragTip', this.dialog).show()
            $('.edui-image-upload1', this.dialog).show()

        },
        drag: function () {
            var me = this
            //做拽上传的支持
            if (Base.supportPreview) {
                me.dialog.find('.edui-image-content,.edui-image-file').on('drop', function (e) {
                    var e = e || window.event
                    e.preventDefault ? e.preventDefault() : e.returnValue = false

                    //获取文件列表
                    var fileList = e.originalEvent.dataTransfer.files

                    $.each(fileList, function (i, f) {
                        if (/^image/.test(f.type)) {
                            //创建图片的base64
                            Base.callback(f)
                        } else {
                            Base.callback(null)
                        }
                    })

                }).on('dragover', function (e) {
                    e.preventDefault()
                }).on('dragenter', function (e) {
                    e.preventDefault()
                })
            }
        },
        toggleMask: function (html) {
            var me = this

            var $mask = $('.edui-image-mask', me.dialog)
            if (html) {
                $('.edui-image-dragTip', me.dialog).css('display', 'none')
                $('.edui-image-upload1', me.dialog).css('display', 'none')
                $mask.addClass('edui-active').html(html)
            } else {

                $mask.removeClass('edui-active').html()

                if (Upload.showCount > 0) {
                    return me
                }

                if (Base.supportPreview) {
                    $('.edui-image-dragTip', me.dialog).css('display', 'block')
                }
                $('.edui-image-upload1', me.dialog).css('display', 'block')
            }

            return me
        }
    }
    // 赋值到全局变量，用于手动提交
    // 配合vue使用,
    // 否则laravel不能通过对用户的验证
    window.UM.getFileFormDate = Upload.getFileFormDate
    window.UM.replaceImageUrl = Upload.replaceImageUrl
    /*
     * 网络图片
     * */
    var NetWork = {
        init: function (editor, $w) {
            var me = this

            me.editor = editor
            me.dialog = $w

            me.initEvt()
        },
        initEvt: function () {
            var me = this,
                url,
                $ele = $('.edui-image-searchTxt', me.dialog)

            $('.edui-image-searchAdd', me.dialog).on('click', function () {
                url = $('.edui-image-searchTxt').val()

                if (url) {

                    $('<img src=\'' + url + '\' class=\'edui-image-pic\' />').on('load', function () {

                        var $item = $('<div class=\'edui-image-item\'><div class=\'edui-image-close\'></div></div>').append(this)

                        $('.edui-image-searchRes', me.dialog).append($item)

                        Base.scale(this, 120)

                        $item.width($(this).width())

                        Base.close($(this))

                        $ele.val('')
                    })
                }
            })
                .hover(function () {
                    $(this).toggleClass('hover')
                })
        }
    }

    var $tab = null,
        currentDialog = null,
        formHandler = false				// 判断父级form是否添加监听事件

    UM.registerWidget('image', {
        tpl: '<link rel="stylesheet" type="text/css" href="<%=image_url%>image.css">' +
            '<div class="edui-image-wrapper">' +
            '<ul class="edui-tab-nav">' +
            '<li class="edui-tab-item edui-active"><a data-context=".edui-image-local" class="edui-tab-text"><%=lang_tab_local%></a></li>' +
            '<li  class="edui-tab-item"><a data-context=".edui-image-JimgSearch" class="edui-tab-text"><%=lang_tab_imgSearch%></a></li>' +
            '</ul>' +
            '<div class="edui-tab-content">' +
            '<div class="edui-image-local edui-tab-pane edui-active">' +
            '<div class="edui-image-content"></div>' +
            '<div class="edui-image-mask"></div>' +
            (Base.supportPreview ? '<div class="edui-image-dragTip"><%=lang_input_dragTip%></div>' : '') +
            '</div>' +
            '<div class="edui-image-JimgSearch edui-tab-pane">' +
            '<div class="edui-image-searchBar">' +
            '<table><tr><td><input class="edui-image-searchTxt" type="text"></td>' +
            '<td><div class="edui-image-searchAdd"><%=lang_btn_add%></div></td></tr></table>' +
            '</div>' +
            '<div class="edui-image-searchRes"></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        initContent: function (editor, $dialog) {
            var lang = editor.getLang('image')['static'],
                opt = $.extend({}, lang, {
                    image_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/image/'
                })

            if (lang) {
                var html = $.parseTmpl(this.tpl, opt)
            }

            currentDialog = $dialog.edui()

            this.root().html(html)

        },
        initEvent: function (editor, $w) {
            $tab = $.eduitab({ selector: '.edui-image-wrapper' })
                .edui().on('beforeshow', function (e) {
                    e.stopPropagation()
                })

            Upload.init(editor, $w)

            NetWork.init(editor, $w)
        },
        buttons: {
            'ok': {
                exec: function (editor, $w) {
                    var sel = '',
                        index = $tab.activate()

                    if (index == 0) {
                        sel = '.edui-image-content .edui-image-pic'
                    } else if (index == 1) {
                        sel = '.edui-image-searchRes .edui-image-pic'
                    }

                    var list = Base.getAllPic(sel, $w, editor)

                    if (index != -1) {
                        editor.execCommand('insertimage', list)
                    }

                    Base.pushFiles()
                }
            },
            'cancel': {
                exec: function () {
                    // 清空Base.tmpFileInput
                    Base.tmpFileInput.length = 0
                }
            }
        },
        width: 700,
        height: 408
    })
    if (Base.supportPreview) {
        // 编辑界面的拖拽事件, 只能拖拽图片
        $('#myEditor').on('drop', function (event) {
            var e = event || window.event,
                files = e.originalEvent.dataTransfer.files, file,
                i = 0, len = files.length,
                url, _this = $(this),
                list = [], str = '',
                fileList, tmpInput
            var range, sel, typePattern = /^image/

            // 阻止浏览器打开图片
            e.preventDefault ? e.preventDefault() : e.returnValue = false
            for (; i < len; i++) {
                file = files[i]
                if (typePattern.test(file.type)) {
                    str += '<img src="' + ImgPreview.prototype.createObjectURL(file) + '" width="200" id="' + (Upload.showCount++) + '"></img>'
                    Base.fileList.push(file)
                }
            }
            this.focus()
            if (window.getSelection && str !== '') {
                sel = window.getSelection()
                if (sel.rangeCount && sel.getRangeAt(0)) {
                    var el = document.createElement('div'),
                        frag = document.createDocumentFragment(),
                        node, lastNode

                    range = sel.getRangeAt(0)
                    range.deleteContents()

                    el.innerHTML = str
                    // 将图片添加到dom片段中
                    i = 0
                    len = el.childNodes.length
                    for (; i < len; i++) {
                        frag.appendChild(el.childNodes[i].cloneNode())
                    }
                    range.insertNode(frag)

                    if (lastNode) {
                        range = range.cloneRange()
                        range.setStartAfter(lastNode)
                        range.collapse(false)
                        sel.removeAllRanges()
                        sel.addRange(range)
                    }
                }
            }

        }).on('dragover', function (event) {
            var e = event || window.event
            e.preventDefault ? e.preventDefault() : e.returnValue = false

        }).on('dragenter', function (event) {
            var e = event || window.event
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        });
    }
    window.imgBase = Base;
})();
