import Vue from 'vue'
import editor from '../src/index'
import template from './index.vue'

Vue.config.productionTip = false;

Vue.use(editor)

new Vue({
    render: h => h(template)
}).$mount('#app')