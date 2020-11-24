import vueRouter from 'vue-router'
import Vue from 'vue'
import indexComponent from '../pages/index.vue'
import otherComponent from '../pages/other.vue'

Vue.use(vueRouter)

const routes = [{
        path: '/',
        component: indexComponent
    }, {
        path: '/other',
        component: otherComponent
    }
]
const router = new vueRouter({
    mode: 'history',
    routes
})

export default router