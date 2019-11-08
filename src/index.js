import umeditor from "./umeditor"
import './umeditor.config'
import ('./style/icofont.min.css')

export default {
    install (Vue, options) {
        Vue.component('umeditor', umeditor)
    }
}
