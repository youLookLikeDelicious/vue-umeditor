export default {
    name: 'umeditor',
    props: {
        nameAttr: {
            default: 'xy_um_editor'
        },
        initMessage: {
            default: 'xy-um-editor'
        },
        height: {
            default: '300px'
        },
        width: {
            default: '100%'
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
        //window.UMEDITOR_CONFIG['imageUrl'] = '<C("UEDITOR_PATH")."php/imageUp.php"?>';
        if (!window.UMEDITOR_CONFIG) {
            window.UMEDITOR_CONFIG = {}
        }
        window.UMEDITOR_CONFIG['imagePath'] = "/";
        window.UMEDITOR_CONFIG['imageUrl'] = 'http://blog1997.com/api/upload/upload-image';

        //实例化编辑器
        this.UM = UM.getEditor(this.umId,{
            initialFrameWidth: this.width,
            autoHeightEnabled: true,
            autoFloatEnabled: true,
            // toolbar: ['emotion']
        });
        UM.umId = this.umId
        UM.areaName = this.nameAttr
        this.UM.setContent(this.initMessage)
        this.$emit('reciveUM', this.UM)
    }
}
