(function(){
	function ImgPreview(input, callback, asyn){
        this.input = input;
		this.imgUrl = null;
		this.fileList = null;			// 当行为为拖拽的时候会用到
		this.asynCallback = null;
		this.asyn= asyn === undefined? true : asyn;	//默认当不支持预览的时候，通过异步上传实现预览
		// 定义回调函数
		this.callback = (callback !== undefined && typeof callback === 'function')?callback:null;
        this.init();
    }
	// 定义createObjectURL属性
    if(window.createObjectURL !== undefined){
        ImgPreview.prototype.createObjectURL = window.createObjectURL;
	}
    else if(window.URL && window.URL.createObjectURL){
        ImgPreview.prototype.createObjectURL = window.URL.createObjectURL;
	}
    else if(window.webkitURL !== undefined){
        ImgPreview.prototype.createObjectURL = window.webkitURL.createObjectURL;
	}
	
	ImgPreview.prototype.supportPreview = (function(){
		var div = document.createElement('div');
		div.innerHTML = ('<input type="file"/>');
		return (div.firstChild.files != undefined && ImgPreview.prototype.createObjectURL != undefined);
	})();
	// 定义初始化方法
	if(ImgPreview.prototype.supportPreview){
		ImgPreview.prototype.init = function(){
			var _this = this;
			// 添加input change的监听事件
			$(this.input).on('change', function(){
				_this.getImgUrl();
				_this.callback(_this.imgUrl);
			});
		}
	} else{
		// 如果不支持预览 通过iframe上传达到预览效果(默认同时不支持input multiple属性)
		// 1、将form提交到iframe
		// 2、iframe调用父窗口的函数，进行回调
		// 3、对结果进行判断，是否合乎要求
		// 4、如果合乎要求图片预览，反之给出提示
		ImgPreview.prototype.init = function(){
			$(this.input).on('change', function(){
				this.parentNode.submit();
			});
			this.asynCallback = function(data){
				// 上传失败
				if(data['state'] !== 'SUCCESS'){
					alert(data['state']);
					return;
				}
				this.callback(data['url'][0]);
			}
		}
	}
	// 验证图片格式的正则
    ImgPreview.prototype.pattern = /jpg$|jpeg$|png$|svg$|gif$|bmp$/i;
    // 获取图片路径和input的files对象
    ImgPreview.prototype.getImgUrl = function(){
		var input = this.input, files = input.files,
			i = 0, len = files.length, urlArr = [], filesArr = [];
		
		if(this.pattern.test(this.input.value)){
			this.imgUrl = this.createObjectURL(files[i]);
			this.fileList = files[i];
		}
		// 单张图片的情况
		if(len == 1){
			return;
		}
		// 有多张图片
		for(++i; i < len; i++){
			if(this.pattern.test(input.value)){
				urlArr.push(this.createObjectURL(files[i]));
				filesArr.push(files[i]);
			}
		}
		this.imgUrl = urlArr;
		this.fileList = filesArr;
    }
	// 如果不支持预览，在页面中加入iframe，实现异步刷新，从而达到预览效果
	if(!ImgPreview.prototype.supportPreview){
		$(document).ready(function(){
			var iframe, div, idocument;
			// 创建div对象,如果不适用div作为中介，document直接追加iframe会报错
			div = document.createElement('div');
			div.id = 'preViewHidForm';
			// 如果追加一个frame元素，则name属性会在ie7中存在BUG
			div.innerHTML = '<iframe name="up" style="display:none"></iframe>';
			// 追加div
			document.body.appendChild(div);
			// 获取iframe
			iframe = document.frames['up'];
            iframe.src = '';
            iframe.target = 'blank';
			// 获取iframe 
			idocument = iframe.contentWindow === undefined? iframe.document : iframe.contentWindow.document;
		});
	}
    window.ImgPreview = function (input, callback, asyn){
        return new ImgPreview(input, callback, asyn);
    };
	window.ImgPreview.prototype = ImgPreview.prototype;
})();