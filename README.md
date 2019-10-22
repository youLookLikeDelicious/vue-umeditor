# vue组件umeditor
```
    使用iconfont重写UI

    重写图片上传部分，实现本地预览

    添加上传代码的功能
```
#### 
> laravel后台示范（引用intervention/image包）  
[代码地址](https://github.com/youLookLikeDelicious/blog1997-api/blob/master/app/Http/Controllers/Upload/UploadController.php)
    
###使用
> 以nuxt为例   
> 1、将node_modules/xy-vue-umeditor/src/static下的plugins文件夹放到项目根目录中的static文件夹中  
> 2、在plugins/umeditor.js文件夹下添加如下代码
```
    import Vue from 'vue'
    import umeditor from 'xy-vue-umeditor'
    Vue.use(umeditor)
```
> 3、在nuxt.config.js中的plugins属性中添加刚才定义的文件
```
    plugins: [
        @/plugins/umeditor
    ]
```
> 4、在模板中使用umedirot
```
    # 必须将umeditor标签放在form标签中
    <form action="">
        <umeditor @reciveUM="reciveUM" />
    </form>
    umeditor挂载完成之后，会emit reciveUM事件，并附带UM实例
    父组需要监听umeidotr的这个事件

    # 其他可选属性(props)
    nameAttr: textarea的name属性, 默认xy_um_editor
    initMessage: 富文本的初始化信息,默认xy-vue-umeditor
    height: 富文本的高度，默认300px
    width: 富文本的宽度，默认100%
```
> 5、如果你想绑定富文本的内容，可以在mounted()方法中添加如下代码(也可以使用dispatchEvetn，需要修改源码😔）  
> ps：这种方式不是真正的数据绑定，提交的时候最好使用getContent()方法获取富文本的内容)  
> 也想过监听onChange事件，但是无效  
```
    this.UM.body.addEventListener('input', () => {
          this.umContent = this.UM.getContent()
    })
    // 正常输入的事件
    this.UM.body.addEventListener('mouseenter', () => {
      this.umContent = this.UM.getContent()
    })
```
> 提示、如果你不使用数据绑定，可直接使用submit按钮提交form表单，editor会自动上传图片，并替blob连接，但需要配置图片上传的地址  
  window.UMEDITOR_CONFIG['imageUrl'] = 'http://****.com/upload/upload-image';   
>
> 你也可以手动上传图片，手动替换blob连接     
>
> window.UM.getFileFormDate()  // 获取formdate  
>> formdata结构  
>> formData.append('upfile[]', input.file) formData.append('id[]', id)   
>> id 属性是返回数组的索引列表         
                                                                  
> window.UM.replaceImageUrl(Array ulr)  // 替换blob地址 
#### 效果图
![alt text](http://i.caigoubao.cc/626561/Screenshot_1.png)
![alt text](http://i.caigoubao.cc/626561/Screenshot_2.png)
