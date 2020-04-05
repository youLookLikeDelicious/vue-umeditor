import umeditor from "./umeditor"
import './umeditor-loader'
import initBaiduMapIframe from './static/plugins/umeditor/dialogs/map/map-template'
/** */
//* 测试使用
// Vue.use({
//     install (Vue, options) {
//         Vue.component('umeditor', umeditor)
//     }
// })
//*/
// 初始化地圖
function initMap () {
    /** 加载百度地图 */
    $(function () {
        $('.ueditor_baidumap').each(function (index, key) {
            initBaiduMapIframe(key)
        })
    })
}
window.initMap = initMap
export { initMap }

// 初始化公式
function initFormula () {
    $(function () {
        $(".mathquill-embedded-latex").each(function (key, v) {
            MQ.StaticMath(v)
        })
    })
}
initFormula()
initMap()

export { initFormula }
export default {
    install (Vue, options) {
        Vue.component('umeditor', umeditor)
    }
}
