/*! highlight compile，只兼容到IE8，方法并不完善，不能用于其他项目的兼容,
    然并卵 不兼容是官方主动放弃的 */
(function(){
	// 兼容ie<=8版本中Array对象不支持forEach方法 
	if(Array.prototype.forEach === undefined){
		Array.prototype.forEach = function(){
			var handler = arguments[0], i = 0, len = this.length;
			
			// 如果参数不是函数 或是数组长度为0 直接退出
			if(typeof handler !== 'function' || len === 0){
				return;
			}
			
			for(; i < len; i++){
				handler(this[i]);
			}
		}
	}
	// 兼容ie<=9版本的Array对象的map方法
	if(Array.prototype.map === undefined){
		Array.prototype.map = function(){
			var handler = arguments[0], i = 0, len = this.length, arr = [];
			
			// 如果参数不是函数 或是数组长度为0 直接退出
			if(typeof handler !== 'function' || len === 0){
				return arr;
			}
			
			for(; i < len; i++){
				arr.push(handler(this[i]));
			}
			
			return arr;
		}
	}
	// 兼容ie<=8版本Array对象的fileter方法
	if(Array.prototype.filter === undefined){
		Array.prototype.filter = function(){
			var handler = arguments[0], tmp, 
				i = 0, len = this.length, arr = [];
			
			// 如果参数不是函数 或是数组长度为0 直接退出
			if(typeof handler !== 'function' || len === 0){
				return arr;
			}
			
			for(; i < len; i++){
				if( handler(this[i]) ){
					arr.push( this[i] );
				}
			}
			return arr;
		}
	}
	// 兼容ie<=8中Object的keys方法
	if(Object.keys === undefined){
		Object.keys = function(){
			var arr = [], i;
			
			if(this.length === 0 ){
				return arr;
			}
			
			for(i in this){
				arr.push(i);
			}
			
			return arr.sort();
		}
	}
	// 兼容IE<=8中Object.create方法
	if(Object.create === undefined){
		Object.create = function(){
			var i,ii, tmp, prot = arguments[0], 
				attr = arguments.length === 2? arguments[1] : null, obj = {};
			if(Object.prototype.toString.call(prot) === '[object Object]'){
				 obj.prototype = prot;
			}
			
			if(attr){
				for(i in attr){
					tmp = attr[i];
					if('value' in tmp){
						for(ii in tmp){
							obj[i] = tmp[ii];
						}
					}
				}
			}
			
			return obj;
		}
	}
	if(!String.prototype.trim){
		String.prototype.trim = function(){
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		}
	}
})();
(function (){
	var Base = {
	type: null,				// 代码的类型
 	patternLt: /</gm,
 	patternGt: />/gm,
	// 对特殊字符进行转义
 	dealWithChar: function(a){
		return a.replace(this.patternLt, '&lt;').replace(this.patternGt, '&gt;');
	},
	// 初始化，监听select 的change时间
	init: function($w){
		this.inited = true;
		$w.find('select').on('change', function(){
			Base.type = this.options[this.selectedIndex].text;
		});
	},
	// 将代码插入到文档中
	insertCode: function(editor, $w){
		var html = $w.find('textarea')[0].value;
		if(!html) return;
		// 获取代码的类型
		this.type = this.type? this.type : $w.find('select option:selected')[0].text;
		html = '<pre><code class="'+this.type+'">'+ this.dealWithChar(html) + '</code></pre>';
		editor.execCommand('insertHTML', html);
	}
}
UM.registerWidget('code', {
	tpl: '<link rel="stylesheet" type="text/css" href="<%=code_url%>code.css">' + 
	'<div class="code-type">&nbsp;&nbsp;&nbsp;&nbsp;<select name="codeType">'+
			'<option>apache</option>'+
			'<option>bash</option>'+
			'<option>cpp</option>'+
			'<option>cs</option>'+
			'<option>css</option>'+
			'<option>coffeescript</option>'+
			'<option>java</option>'+
			'<option>javascript</option>'+
			'<option>json</option>'+
			'<option>http</option>'+
			'<option>php</option>'+
			'<option>makefile</option>'+
			'<option>markdown</option>'+
			'<option>nginx</option>'+
			'<option>objectivec</option>'+
			'<option>perl</option>'+
			'<option>properties</option>'+
			'<option>python</option>'+
			'<option>xml</option>'+
			'<option>sql</option>'+
		'</select></div>'+
	'<div class="code-content"><textarea></textarea></div>',
	initContent: function (editor, $dialog) {
		var lang = editor.getLang('image')["static"],
			opt = $.extend({}, lang, {
				code_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/code/'
			});
		
		if (lang) {
			var html = $.parseTmpl(this.tpl, opt);
		}
		
		currentDialog = $dialog.edui();

		this.root().html(html);
	},
	initEvent: function (editor, $w) {
		var type = Base.type;
		Base.init($w);

		if(type){
			$w.find('select option').filter(function(){
				return this.text == type;
			}).attr('selected', true);
		}
	},
	buttons: {
		'ok': {
			exec: function (editor, $w) {
				Base.insertCode(editor,$w);
			}
		},
		'cancel': {
		}
	},
	width: 350,
	height: 408
});
})();