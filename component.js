export default {
    name: 'umeditor',
    props: {
        nameAttr: {
            type: String,
            default () {
                return 'xy_um_editor'
            }
        },
        initMessage: {
            type: String,
            default () {
                return '@blog1997/vue-umeditor'
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
        }
    },
    data() {
        return {
            umId: 'um_editor_' + (Math.random().toFixed(3)).toString().replace('.', '_'),
            UM: undefined, // UM对象
        }
    },
    render (h) {
        return h('script', {
            domProps: {
                type: 'text/plain',
                id: this.umId,
            },
            attrs:{
                class: 'um_editor',
                name: this.nameAttr,// name写在别的地方就会报错
            },
            style: {
                height: this.height
            },
        })
    },
    mounted () {
        if (!window.UMEDITOR_CONFIG) {
            window.UMEDITOR_CONFIG = {}
        }
        
        // window.UMEDITOR_CONFIG['imagePath'] = "/";
        // window.UMEDITOR_CONFIG['imageUrl'] = this.uploadUrl;

        const umConfig = {
            initialFrameWidth: this.width,
            autoHeightEnabled: true,
            autoFloatEnabled: true
        }

        if (this.toolbar) {
            umConfig.toolbar = this.toolbar
        }
        //实例化编辑器
        this.UM = UM.getEditor(this.umId, umConfig)

        UM.areaName = this.nameAttr
        if (this.initMessage) {
            this.UM.setContent(this.initMessage)
        }
        this.$emit('receiveUM', this.UM)
    },
    beforeDestroy () {
        this.UM.destroy()
    }
}
