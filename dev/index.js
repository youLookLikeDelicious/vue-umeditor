import Vue from 'vue'
import editor from '../src/index'
import App from './App.vue'
import router from './route'

Vue.config.productionTip = false;

Vue.use(editor)

const um = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')