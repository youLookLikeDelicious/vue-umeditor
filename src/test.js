const component = {
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
          // return 'http://www.blog1997.com:88/api/admin/article-upload-image'
        }
      }
    },
    data () {
      return {
        umId: 'um_editor_' + (Math.random().toFixed(3)).toString().replace('.', '_'),
        UM: undefined // UM对象
      }
    },
    render (h) {
      return h('script', {
        domProps: {
          type: 'text/plain',
          id: this.umId
        },
        attrs: {
          class: 'um_editor',
          name: this.nameAttr// name写在别的地方就会报错
        },
        style: {
          height: this.height
        }
      })
    },
    mounted () {
      this.$emit('receiveUM', {
        setContent () {
  
        },
        getContent () {
  
        },
        setHide () {
  
        },
        setShow () {
  
        }
      })
    }
  }
  export default {
    install (vue) {
      vue.component('umeditor', component)
    }
  }
  