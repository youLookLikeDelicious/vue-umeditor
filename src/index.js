import './umeditor-loader'
import component from "../component"
import initBaiduMapIframe from './static/plugins/umeditor/dialogs/map/map-template'

// 初始化地图
function initMap(doc) {
    if (!doc) {
        doc = document
    }
    /** 加载百度地图 */
    $(function () {
        $(doc).find('.ueditor_baidumap').each(function (index, key) {
            // 已经初始化，无需再次操作
            if ($(key).attr('init')) {
                return
            }

            $(key).attr('init', '1')
            initBaiduMapIframe(key)
        })
    })
}
window.initMap = initMap
export {
    initMap
}

function convertLatex(doc) {
    doc = doc || window.document
    $(function () {
        $(doc).find('.mathquill-embedded-latex').each(function (key, v) {
            // 已经初始化，无需任何操作
            if ($(v).attr('init')) {
                return
            }
            $(v).attr('init', '1')
            MQ.StaticMath(v)
        })
    })
}

// 初始化公式
function initFormula(doc) {
    convertLatex(doc)
}

window.initFormula = initFormula

export {
    initFormula
}

const VueUmeditor = {
    install(Vue, options) {
        Vue.component('umeditor', component)
    }
}
window.VueUmeditor = VueUmeditor
export default VueUmeditor