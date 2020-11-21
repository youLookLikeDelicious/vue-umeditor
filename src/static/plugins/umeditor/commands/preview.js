import './preview.css'
import initBaiduMapIframe from '../dialogs/map/map-template'

UM.commands.preview = {
    execCommand: function () {
        var title = this.options.lang === "zh-cn" ? "预览" : "preview",
            previewBox = $('<div class="umeditor-preview-box"><div class="umeditor-preview"></div></div>'),
            template = '<header class="umeditor-preview-header"><span>'+ title +'</span><span class="umeditor-preview-close-btn">X</span></header>' + this.getContent()

        console.log(previewBox.children())
        previewBox.find('.umeditor-preview').html(template)
        previewBox.appendTo(document.body)
        
        $('iframe', '.umeditor-preview-box').each(function(index, iframe) {
            initBaiduMapIframe(iframe)
        })

        // 初始化公式
        $('.mathquill-embedded-latex', '.umeditor-preview-box').each(function (key, element) {
            // 已经初始化，无需任何操作
            if ($(element).attr('init')) {
                return
            }
            $(element).attr('init', '1')
            MQ.StaticMath(element)
        })

        function closePanel () {
            $('.umeditor-preview-box').remove()
        }

        $('.umeditor-preview-close-btn').on('click', closePanel)
    },
    notNeedUndo: 1
};
