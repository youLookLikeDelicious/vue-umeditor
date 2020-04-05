"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function getMapTemplate(doc) {
  var div = doc.createElement('div');
  div.innerHTML = "<div style=\"border:#ccc solid 1px;\" id=\"dituContent\"></div>";
  var script = doc.createElement('script');
  script.innerHTML = "\n        function getParam(name) {\n            // return location.href.match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';\n            return iframe.getAttribute('_src').match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';\n        }\n        var map, marker;\n        var iframe = getSelfIframe();\n        var centerParam = getParam('center');\n        var zoomParam = getParam('zoom');\n        var widthParam = getParam('width');\n        var heightParam = getParam('height');\n        var markersParam = getParam('markers');\n        var markerStylesParam = getParam('markerStyles');\n        var UM = parent.UM;\n        var editor = getEditor();\n\n        // \u8BBE\u7F6Eiframe\u7684\u5927\u5C0F\n        iframe.style.width = parseInt(widthParam) + 20 + 'px'\n        iframe.style.height = parseInt(heightParam) + 'px'\n        iframe.style.overflow = 'hidden'\n\n        //\u521B\u5EFA\u548C\u521D\u59CB\u5316\u5730\u56FE\u51FD\u6570\uFF1A\n        function initMap() {\n            // [FF]\u5207\u6362\u6A21\u5F0F\u540E\u62A5\u9519\n            if (!window.BMap) {\n                return;\n            }\n            var dituContent = document.getElementById('dituContent');\n            dituContent.style.width = widthParam + 'px';\n            dituContent.style.height = heightParam + 'px';\n\n            createMap();//\u521B\u5EFA\u5730\u56FE\n            setMapEvent();//\u8BBE\u7F6E\u5730\u56FE\u4E8B\u4EF6\n            addMapControl();//\u5411\u5730\u56FE\u6DFB\u52A0\u63A7\u4EF6\n\n            // \u521B\u5EFA\u6807\u6CE8\n            var markersArr = markersParam.split(',');\n            var point = new BMap.Point(markersArr[0], markersArr[1]);\n            marker = new BMap.Marker(point);\n            marker.enableDragging();\n            map.addOverlay(marker); // \u5C06\u6807\u6CE8\u6DFB\u52A0\u5230\u5730\u56FE\u4E2D\n            marker.setAnimation(BMAP_ANIMATION_BOUNCE)\n            if(iframe && UM && editor) { //\u5728\u7F16\u8F91\u72B6\u6001\u4E0B\n                setMapListener();//\u5730\u56FE\u6539\u53D8\u4FEE\u6539\u5916\u5C42\u7684iframe\u6807\u7B7Esrc\u5C5E\u6027\n            } else {\n                document.focus();\n            }\n        }\n\n        //\u521B\u5EFA\u5730\u56FE\u51FD\u6570\uFF1A\n        function createMap() {\n            map = new BMap.Map(\"dituContent\");//\u5728\u767E\u5EA6\u5730\u56FE\u5BB9\u5668\u4E2D\u521B\u5EFA\u4E00\u4E2A\u5730\u56FE\n            var centerArr = centerParam.split(',');\n            var point = new BMap.Point(parseFloat(centerArr[0]), parseFloat(centerArr[1]));//\u5B9A\u4E49\u4E00\u4E2A\u4E2D\u5FC3\u70B9\u5750\u6807\n            map.centerAndZoom(point, parseInt(zoomParam));//\u8BBE\u5B9A\u5730\u56FE\u7684\u4E2D\u5FC3\u70B9\u548C\u5750\u6807\u5E76\u5C06\u5730\u56FE\u663E\u793A\u5728\u5730\u56FE\u5BB9\u5668\u4E2D\n        }\n\n        //\u5730\u56FE\u4E8B\u4EF6\u8BBE\u7F6E\u51FD\u6570\uFF1A\n        function setMapEvent() {\n            map.enableDragging();//\u542F\u7528\u5730\u56FE\u62D6\u62FD\u4E8B\u4EF6\uFF0C\u9ED8\u8BA4\u542F\u7528(\u53EF\u4E0D\u5199)\n            map.enableScrollWheelZoom();//\u542F\u7528\u5730\u56FE\u6EDA\u8F6E\u653E\u5927\u7F29\u5C0F\n            map.enableDoubleClickZoom();//\u542F\u7528\u9F20\u6807\u53CC\u51FB\u653E\u5927\uFF0C\u9ED8\u8BA4\u542F\u7528(\u53EF\u4E0D\u5199)\n            map.enableKeyboard();//\u542F\u7528\u952E\u76D8\u4E0A\u4E0B\u5DE6\u53F3\u952E\u79FB\u52A8\u5730\u56FE\n        }\n\n        //\u5730\u56FE\u63A7\u4EF6\u6DFB\u52A0\u51FD\u6570\uFF1A\n        function addMapControl() {\n            //\u5411\u5730\u56FE\u4E2D\u6DFB\u52A0\u7F29\u653E\u63A7\u4EF6\n            var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});\n            map.addControl(ctrl_nav);\n            //\u5411\u5730\u56FE\u4E2D\u6DFB\u52A0\u7F29\u7565\u56FE\u63A7\u4EF6\n            var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});\n            map.addControl(ctrl_ove);\n            //\u5411\u5730\u56FE\u4E2D\u6DFB\u52A0\u6BD4\u4F8B\u5C3A\u63A7\u4EF6\n            var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});\n            map.addControl(ctrl_sca);\n        }\n\n        function setMapListener() {\n            var timer;\n\n            map.addEventListener('moveend', mapListenerHandler);\n            map.addEventListener('zoomend', mapListenerHandler);\n            marker.addEventListener('dragend', mapListenerHandler);\n\n            function mapListenerHandler() {\n                var zoom = map.getZoom(),\n                    center = map.getCenter(),\n                    marker = window.marker.P;\n\n                iframe.setAttribute('_src', iframe.getAttribute('_src').\n                    replace(new RegExp('([?#&])center=([^?#&]+)', 'i'), '$1center=' + center.lng + ',' + center.lat).\n                    replace(new RegExp('([?#&])markers=([^?#&]+)', 'i'), '$1markers=' + center.lng + ',' + center.lat).\n                    replace(new RegExp('([?#&])zoom=([^?#&]+)', 'i'), '$1zoom=' + zoom));\n                editor.fireEvent('saveScene');\n                saveScene(editor);\n            }\n\n            function saveScene(){\n                if(!timer) {\n                    timer = setTimeout(function(){\n                        editor.fireEvent('savescene');\n                        editor.fireEvent('contentchange');\n                        timer = null;\n                    }, 1000);\n                }\n            }\n        }\n\n        function getSelfIframe(){\n            var iframes = parent.document.getElementsByTagName('iframe');\n            for (var key in iframes) {\n                if (iframes[key].contentWindow == window) {\n                    return iframes[key];\n                }\n            }\n            return null;\n        }\n\n        function getEditor(){\n            var parentNode = iframe.parentNode;\n            while (parentNode && parentNode.tagName && parentNode.tagName.toLowerCase() != 'body') {\n                if (parentNode.className && parentNode.className.indexOf('edui-body-container')!=-1) {\n                    return UM.getEditor(parentNode.id);\n                }\n                parentNode = parentNode.parentNode;\n            }\n            return null;\n        }\n        window.initMap = initMap\n    ";
  var fragment = doc.createDocumentFragment();
  fragment.appendChild(div);
  fragment.appendChild(script);
  return fragment;
} // 如果iframe中没有script标签，向iframe中追加内容


function _default(iframe) {
  var doc, _window;

  doc = iframe.contentWindow.document || iframe.contentDocument;
  _window = iframe.contentWindow;

  if (_window.init) {
    return;
  }

  _window.init = true;

  if (doc.querySelector('script')) {
    return;
  }

  _window.BMap_loadScriptTime = new Date().getTime();
  var scriptLink = doc.createElement('script');
  scriptLink.type = 'text/javascript';
  scriptLink.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=6b6c1a67eaa7db1ca6d6da28e590e343&services=true&t=20200103103842';

  scriptLink.onload = function () {
    _window.initMap();
  };

  var style = doc.createElement('style');
  style.innerHTML = "\nhtml, body {\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n}";

  try {
    doc.head.appendChild(style);
    doc.body.appendChild(getMapTemplate(doc));
    doc.body.appendChild(scriptLink);
  } catch (e) {
    _window.onload = function () {
      doc.head.appendChild(style);
      doc.body.appendChild(getMapTemplate(doc));
      doc.body.appendChild(scriptLink);
    };
  }
}