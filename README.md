# vue组件umeditor
[![Current Release](https://img.shields.io/npm/v/@blog1997/vue-umeditor)](https://www.npmjs.com/package/@blog1997/vue-umeditor)
[![license](https://img.shields.io/github/license/youLookLikeDelicious/vue-umeditor)](https://github.com/youLookLikeDelicious/vue-umeditor/blob/master/LICENSE.md)
![javascript](https://img.shields.io/github/languages/top/youLookLIkeDelicious/vue-umeditor)
### 效果图
![rendering](https://github.com/youLookLikeDelicious/vue-umeditor/blob/master/doc/img/Screenshot_3.png?raw=true)
1. 使用iconfont重写UI
2. 重写图片上传部分，实现本地预览
3. 添加上传代码的功能
4. 支持插入百度地图

### 兼容性
IE >= 10 (插入地图、公式的功能也可以在IE9中使用)  
Chrome  
Firebox

### 依赖
1. jQuery
2. umeditor
3. MathQuill
4. baiduMap
### 使用
*其他关于umeditor的操作请参考[官方文档](http://ueditor.baidu.com/website/umeditor.html)*

#### 安装
```bash
npm install raw-loader --save-dev
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

#### 提示
1、 这个包使用的是ES6语法，需要在使用的时候配置一下babel-loader。  
例如：  
在vue项目中，需要对[transpileDependencies](https://cli.vuejs.org/zh/config/#transpiledependencies)属性进行配置  
在nuxt项目中，对[transpile](https://zh.nuxtjs.org/api/configuration-build/#transpile)属性进行配置    
2、 内置了一个模拟组件，用于测试，这样不必在测试中加载其他的第三方插件  
```javascript
import umeditor from '@blog1997/vue-umeditor/test'
```

#### 演示地址
[vue-umeditor演示地址](https://www.chaosxy.com/archives/84554c2.html)
