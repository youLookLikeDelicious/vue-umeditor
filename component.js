export default {
    name: 'umeditor',
    props: {
        nameAttr: {
            type: String,
            default () {
                return 'xy_um_editor'
            }
        },
        height: {
            type: String,
            default () {
                return '300px'
            }
        },
        width: {
            type: String,
            default () {
                return '100%'
            }
        },
        toolbar: {
            type: [Array, String],
            default () {
                return ''
            }
        },
        uploadUrl: {
            type: String,
            default () {
                return ''
            }
        },
        baiduMapAk: {
            type: String,
            default () {
                return ''
            }
        },
        lang: {
            type: String,
            default () {
                return 'zh-cn'
            }
        }
    },
    data() {
        return {
            umId: 'um_editor_' + (Math.random().toFixed(3)).toString().replace('.', '_'),
            UM: undefined, // UM对象
            umConfig: {}
        }
    },
    render(h) {
        return h('script', {
            domProps: {
                type: 'text/plain',
                id: this.umId,
            },
            attrs: {
                class: 'um_editor',
                name: this.nameAttr,
            },
            style: {
                height: this.height
            },
        })
    },
    methods: {
        /**
         * 监听内容修改的事件
         */
        contentChangeHandler() {
            this.syncContent(this.UM.getContent())
        },
        /**
         * 同步绑定的内容
         * @param {string} content 
         */
        syncContent(content = '') {
            this.$emit('input', content)
        },
        /**
         * 初始化配置信息
         */
        beforeInit() {
            const umConfig = {
                initialFrameWidth: this.width,
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                lang: this.lang
            }


            // 设置菜单栏
            if (this.toolbar) {
                umConfig.toolbar = this.toolbar
            }

            if (this.baiduMapAk) {
                UM.I18N['en'].map.static.baiduMapAk = this.baiduMapAk
                UM.I18N['zh-cn'].map.static.baiduMapAk = this.baiduMapAk
            }

            this.umConfig = {
                ...umConfig
            }
            this.$emit('before-init')
        },
        /**
         * 实例化编辑器之后的操作
         */
        afterInit() {
            this.$emit('receiveUM', this.UM)
            // 监听内容的更改
            this.UM.addListener('contentChange', this.contentChangeHandler);
        },
        /**
         * 实例话编辑器
         */
        init() {
            this.beforeInit()

            //实例化编辑器
            this.UM = UM.getEditor(this.umId, this.umConfig)

            if (this.$attrs.value) {
                this.UM.setContent(this.$attrs.value)
                this.UM.execCommand('inserthtml', '')
            }
            this.afterInit()
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.UM.destroy()
        this.UM = ''
    },
    destroyed() {
        try {
            const el = document.getElementById(this.umId)
            el.parentElement.removeChild(el)
        } catch (e) {
        }
    }
}