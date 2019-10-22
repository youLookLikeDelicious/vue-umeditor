import umeditor from "./umeditor"
import './umeditor.config'
import ('./style/icofont.min.css')
Vue.component('umeditor', umeditor)
export default {
    install (Vue, options) {
        Vue.component('umeditor', umeditor)
    }
}
