# vue组件umeditor
```
    使用iconfont重写UI

    重写图片上传部分，实现本地预览

    添加上传代码的功能
```

    
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