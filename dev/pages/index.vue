<template>
  <div id="app">
    <div class="bind-data" v-html="content" contenteditable="true" @input="setContent"></div>
    <div>
      <umeditor
        v-if="rendereditor"
        v-model="content"
        @before-init="beforeInit"
        @receiveUM="
          (um) => {
            this.editor = um;
          }
        "
        baiduMapAk="IaNYeZtR3jsoZhA9cH7EOAZQ4Ynp2KT7"
        :lang="lang"
        :upload-url="'http://baidu.com'"
      />
    </div>

    <div class="btn-wrapper">
      <input type="submit" value="提交" />
      <input type="button" @click="destroyEditor" value="destroy" />
      <input type="button" @click="reload" value="reload" />
      <input type="button" @click="uploadImage" value="uploadImage" />
      <input type="button" @click="formula" value="同步公式" />
      <input type="button" @click="initMap" value="同步地图" />
    </div>
    <div>
      <umeditor @receiveeditor="receiveeditor2" lang="en" />
    </div>
    <!-- <div v-html="html"></div> -->
  </div>
</template>

<script>

export default {
  data() {
    return {
      editor: "",
      editor2: "",
      lang: "zh-cn",
      rendereditor: true,
      // content: '<p><span class="mathquill-embedded-latex" style="width: 29.2344px; height: 48.2812px;">\\frac{2}{2}</span></p>',
      // content: "<p>vue umeditor<span class='mathquill-embedded-latex'>\frac{1}{2}</span><span class='mathquill-embedded-latex'>\\frac{1}{12}</span></p>" + '<iframe class="ueditor_baidumap" _src="about:blank;?#center=116.404,39.915&zoom=10&width=530&height=340&markers=116.404,39.915" frameborder="0" style="width: 550px; height: 340px; overflow: hidden;"></iframe>',
      content: '<span class="mathquill-embedded-latex" style="width: 29.2344px; height: 48.2812px;">\\frac{ }{ }</span><img data-src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608144854091&di=e8672f16ccfc11de3cb9e73932706bf3&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F27%2F67%2F01300000921826141299672233506.jpg">'
    };
  },
  methods: {
    // 接收UM实例
    receiveeditor2(editor) {
      this.editor2 = editor;
    },
    // 接收UM实例
    destroyEditor() {
      this.rendereditor = false;
    },
    /**
     * 重新载入组件
     * 目前依旧无法操作成功
     */
    reload() {
      if (!this.rendereditor) {
        this.rendereditor = true;
      }
    },
    // 上传图片
    uploadImage() {
      const images = this.editor.getFileFormData();
      const formData = new FormData
      images.forEach(element => {
        formData.append('upfile[]', element)
      });
      axios
        .post("https://www.blog1997.com/api/admin/upload/image/article", formData)
        .then((response) => {
          this.editor.replaceImageUrl(response.data.data)
        });
    },
    formula () {
      initFormula()
    },
    initMap () {
      initMap()
    },
    /**
     * 切换语言
     */
    changeLang() {
      if (this.lang === "zh-cn") {
        this.lang = "en";
      } else {
        this.lang = "zh-cn";
      }
    },
    /**
     * 扩展富文本
     */
    beforeInit() {
      UM.registerUI("save", function (name) {
        //该方法里的this指向编辑器实例
        var me = this,
          //实例化一个UMEDITOR提供的按钮对象
          $button = $.eduibutton({
            //按钮icon的名字， 在这里会生成一个“edui-icon-save”的className的icon box，
            //用户可以重写该className的background样式来更改icon的图标
            //覆盖示例见btn.css
            icon: "icofont-architecture-alt",
            title: me.options.lang === "zh-cn" ? "保存" : "save",
            click: function () {
              //在这里处理按钮的点击事件
              //点击之后执行save命令
              me.execCommand(name);
            },
          });

        //在这里处理保存按钮的状态反射
        me.addListener("selectionchange", function () {
          //检查当前的编辑器状态是否可以使用save命令
          var state = this.queryCommandState(name);

          //如果状态表示是不可用的( queryCommandState()的返回值为-1 )， 则要禁用该按钮
          $button
            .edui()
            .disabled(state == -1)
            .active(state == 1);
        });
        //返回该按钮对象后， 该按钮将会被附加到工具栏上
        return $button;
      });
      
      // 默认载入自定义的 菜单
      UMEDITOR_CONFIG.toolbar.push("save");
    },
    /**
     * 编辑当前组件的 content 的值
     */
    setContent(event) {
      console.log(event.target.innerHTML)
      this.content = event.target.innerHTML
    }
  },
  computed: {
    html() {
      return this.editor ? this.editor.getContent() : "";
    },
  },
  mounted() {
    // console.log(this.editor)
  },
};
</script>

<style>
.bind-data {
  width: 97%;
  padding: 5px 7px;
  position: relative;
  box-shadow: 0 0 3px 1px #999;
  box-sizing: border-box;
  margin-bottom: 12px;
  margin-left: auto;
  margin-right: auto;
}
.btn-wrapper {
  margin-top: 17px;
}
</style>