function getMapTemplate (protocol) {    
    return`
<!DOCTYPE html>    
<html>
<head>
<style>
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
<script src=${protocol}//api.map.baidu.com/getscript?v=2.0&ak=6b6c1a67eaa7db1ca6d6da28e590e343&services=true&t=20200103103842></script>
</head>
<body>
<div style="border:#ccc solid 1px;" id="dituContent"></div>
<script type="text/javascript">
function getParam(name) {
    // return location.href.match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';
    return iframe.getAttribute('_src').match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';
}
var map, marker;
var iframe = getSelfIframe();
var centerParam = getParam('center');
var zoomParam = getParam('zoom');
var widthParam = getParam('width');
var heightParam = getParam('height');
var markersParam = getParam('markers');
var markerStylesParam = getParam('markerStyles');
var UM = parent.UM;
var editor = getEditor();

// 设置iframe的大小
iframe.style.width = parseInt(widthParam) + 20 + 'px'
iframe.style.height = parseInt(heightParam) + 'px'
iframe.style.overflow = 'hidden'

//创建和初始化地图函数：
function initMap() {
    // [FF]切换模式后报错
    if (!window.BMap) {
        return;
    }
    var dituContent = document.getElementById('dituContent');
    dituContent.style.width = widthParam + 'px';
    dituContent.style.height = heightParam + 'px';

    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件

    // 创建标注
    var markersArr = markersParam.split(',');
    var point = new BMap.Point(markersArr[0], markersArr[1]);
    marker = new BMap.Marker(point);
    marker.enableDragging();
    map.addOverlay(marker); // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE)
    if(iframe && UM && editor) { //在编辑状态下
        setMapListener();//地图改变修改外层的iframe标签src属性
    } else {
        document.focus();
    }
}

//创建地图函数：
function createMap() {
    map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
    var centerArr = centerParam.split(',');
    var point = new BMap.Point(parseFloat(centerArr[0]), parseFloat(centerArr[1]));//定义一个中心点坐标
    map.centerAndZoom(point, parseInt(zoomParam));//设定地图的中心点和坐标并将地图显示在地图容器中
}

//地图事件设置函数：
function setMapEvent() {
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}

function setMapListener() {
    var timer;

    map.addEventListener('moveend', mapListenerHandler);
    map.addEventListener('zoomend', mapListenerHandler);
    marker.addEventListener('dragend', mapListenerHandler);

    function mapListenerHandler() {
        var zoom = map.getZoom(),
            center = map.getCenter(),
            marker = window.marker.P;

        iframe.setAttribute('_src', iframe.getAttribute('_src').
            replace(new RegExp('([?#&])center=([^?#&]+)', 'i'), '$1center=' + center.lng + ',' + center.lat).
            replace(new RegExp('([?#&])markers=([^?#&]+)', 'i'), '$1markers=' + center.lng + ',' + center.lat).
            replace(new RegExp('([?#&])zoom=([^?#&]+)', 'i'), '$1zoom=' + zoom));
        editor.fireEvent('saveScene');
        saveScene(editor);
    }

    function saveScene(){
        if(!timer) {
            timer = setTimeout(function(){
                editor.fireEvent('savescene');
                editor.fireEvent('contentchange');
                timer = null;
            }, 1000);
        }
    }
}

function getSelfIframe(){
    var iframes = parent.document.getElementsByTagName('iframe');
    for (var key in iframes) {
        if (iframes[key].contentWindow == window) {
            return iframes[key];
        }
    }
    return null;
}

function getEditor(){
    var parentNode = iframe.parentNode;
    while (parentNode && parentNode.tagName && parentNode.tagName.toLowerCase() != 'body') {
        if (parentNode.className && parentNode.className.indexOf('edui-body-container')!=-1) {
            return UM.getEditor(parentNode.id);
        }
        parentNode = parentNode.parentNode;
    }
    return null;
}
window.initMap = initMap
window.onload = initMap
</script>
<body>
</html>
`
}

// 如果iframe中没有script标签，向iframe中追加内容
export default function (iframe) {
    var doc, _window;

    doc = iframe.contentWindow.document || iframe.contentDocument
    _window = iframe.contentWindow
    
    // 只需初始化一次
    if (_window.init) {
        return
    }
    _window.init = true
    
    // if (doc.querySelector('script')) {
    //     return
    // }
    
    _window.BMap_loadScriptTime = (new Date).getTime()
    
    doc.open()
    doc.write(getMapTemplate(parent.document.location.protocol))
    doc.close()
}