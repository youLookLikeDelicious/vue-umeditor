# vue组件umeditor
![Current Release](https://img.shields.io/npm/v/@blog1997/vue-umeditor)
![license](https://img.shields.io/github/license/youLookLikeDelicious/vue-umeditor)
[![Coverage Status](https://coveralls.io/repos/github/youLookLikeDelicious/vue-umeditor/badge.svg?branch=master)](https://coveralls.io/github/youLookLikeDelicious/vue-umeditor?branch=master)
1. 使用iconfont重写UI
2. 重写图片上传部分，实现本地预览
3. 添加上传代码的功能

### 兼容性
IE >= 10

### 依赖
1. jQuery
2. umeditor
3. MathQuill
4. baiduMap
### 使用
#### 安装
```bash
npm install '@blog1997/vue-umeditor' --save
```

#### 注册全局组件
```javascript
import editor from '@blog1997/vue-umeditor'
import Vue from 'vue'

Vue.use(editor)
```

#### 定义模板
```html
<div id="editor">
  <umeditor @receiveUM="receiveUM"/>
</div>
```

#### 挂载模板
```javascript
new Vue({
  el: '#editor',
  data() {
    return {
      editor: ''
    }
  },
  methods: {
    receiveUM (editor) {
      this.editor = editor
    }
  }
})
```

#### 演示地址
[vue-umeditor演示地址](https://www.chaosxy.com/archives/84554c2.html)

*如果有什么意见或是建议，欢迎留言讨论*

[issue](https://github.com/youLookLikeDelicious/vue-umeditor)