"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default2 = {
  name: 'umeditor',
  props: {
    nameAttr: {
      type: String,
      "default": function _default() {
        return 'xy_um_editor';
      }
    },
    initMessage: {
      type: String,
      "default": function _default() {
        return '@blog1997/um-editor';
      }
    },
    height: {
      type: String,
      "default": function _default() {
        return '300px';
      }
    },
    width: {
      type: String,
      "default": function _default() {
        return '100%';
      }
    },
    toolbar: {
      type: [Array, String],
      "default": function _default() {
        return '';
      }
    },
    uploadUrl: {
      type: String,
      "default": function _default() {
        return ''; // return 'http://www.blog1997.com:88/api/admin/article-upload-image'
      }
    }
  },
  data: function data() {
    return {
      umId: 'um_editor_' + Math.random().toFixed(3).toString().replace('.', '_'),
      UM: undefined // UM对象

    };
  },
  render: function render(h) {
    return h('script', {
      domProps: {
        type: 'text/plain',
        id: this.umId
      },
      attrs: {
        "class": 'um_editor',
        name: this.nameAttr // name写在别的地方就会报错

      },
      style: {
        height: this.height
      }
    });
  },
  mounted: function mounted() {
    if (!window.UMEDITOR_CONFIG) {
      window.UMEDITOR_CONFIG = {};
    }

    window.UMEDITOR_CONFIG['imagePath'] = "/";
    window.UMEDITOR_CONFIG['imageUrl'] = this.uploadUrl;
    var umConfig = {
      initialFrameWidth: this.width,
      autoHeightEnabled: true,
      autoFloatEnabled: true
    };

    if (this.toolbar) {
      umConfig.toolbar = this.toolbar;
    } //实例化编辑器


    this.UM = UM.getEditor(this.umId, umConfig);
    UM.umId = this.umId;
    UM.areaName = this.nameAttr;
    this.UM.setContent(this.initMessage);
    this.$emit('reciveUM', this.UM);
  }
};
exports["default"] = _default2;