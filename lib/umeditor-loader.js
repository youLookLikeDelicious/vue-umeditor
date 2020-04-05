"use strict";

require("./jQuery");

require("./static/plugins/umeditor/themes/default/css/umeditor.css");

require("./static/plugins/umeditor/third-party/imgPreview.js");

require("./static/plugins/umeditor/template");

require("./static/plugins/umeditor/umeditor.config.js");

require("./static/plugins/umeditor/umeditor.min.js");

require("./static/plugins/umeditor/lang/zh-cn/zh-cn.js");

require("./static/style/icofont.min.css");

var _mathquill = _interopRequireDefault(require("./static/plugins/umeditor/dialogs/formula/mathquill.min"));

require("./static/plugins/umeditor/dialogs/code/code");

require("./static/plugins/umeditor/dialogs/emotion/emotion");

require("./static/plugins/umeditor/dialogs/formula/formula");

require("./static/plugins/umeditor/dialogs/image/image");

require("./static/plugins/umeditor/dialogs/link/link");

require("./static/plugins/umeditor/dialogs/map/map");

require("./static/plugins/umeditor/dialogs/video/video");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// iframe中的样式，无需在这里导入
// import './static/plugins/umeditor/dialogs/formula/mathquill.css'
window.MathQuillV10 = _mathquill["default"];
var MQ = MathQuill.getInterface(2);
window.MQ = MQ;