<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" href="highLightClient/css/style.css">
	<script type="text/javascript" src="highLightClient/js/highlight.pack.js"></script>
	<script>
		document.addEventListener('DOMContentLoaded', function(){
			var tmp, code = document.getElementsByTagName('code'), i = 0, len = code.length, tdLeft = '', tdRight = '';
			
			for(; i < len; i++){
				tmp = code[i];
				// 显示行数
				hljs.highlightBlock(tmp);

				// 获取高亮的html，并按行分成数组
				html = tmp.innerHTML;
				lineArr = html.split('\n');
				table = '<table>';
						
				tdLeft = '';
				tdRight = '';
				for(var j = 0, count = j + 1, llen = lineArr.length; j < llen; count++,j++){
					tdLeft += '<div class="line">'+count+'</div>';
					tdRight += '<div class="line">'+lineArr[j]+'</div>';
				}
				table += '<td class="td-left">' + tdLeft + '</td>';
				table += '<td class="td-right">' + tdRight + '</td>';
				table += '</tr></table>';
				tmp.innerHTML = table;
			}
		});
		
	</script>
	<title>Document</title>
</head>
<body>
	<?php
		echo $_POST['myEditor'];
	?>
</body>
</html>